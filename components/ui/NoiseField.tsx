"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SIGNATURE, "noise -> signal".
 * A WebGL field of animated grain that starts dense (the startup nobody
 * notices) and RESOLVES into a calm, near-black field with one violet
 * bloom (the moment of being seen). Sits behind the hero headline.
 *
 * Performance contract:
 *  - one fullscreen-triangle draw call, one fragment program
 *  - device-pixel-ratio capped at 1.5
 *  - IntersectionObserver pauses the RAF loop when the hero is offscreen
 *  - prefers-reduced-motion -> a single static, fully-resolved frame, no loop
 *  - WebGL unavailable / context lost -> renders nothing, hero still works
 *
 * The context is requested with `alpha: true` and never with `alpha: false`.
 * An opaque WebGL canvas that never gets drawn is not blank, it is BLACK, and
 * this one sits directly behind near-black headline type on a paper canvas.
 * Every failure path here (no WebGL, failed compile, failed link, lost
 * context, a drawing buffer cleared by a resize) has to degrade to
 * transparent, or it degrades to an unreadable hero instead.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// value-noise + fbm; uResolve in [0,1] decays grain amplitude and reveals the
// indigo bloom. uAspect keeps the bloom circular across viewport ratios.
const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform float uResolve;   // 0 = pure noise, 1 = settled signal
uniform float uAspect;

float hash(vec2 p){
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0, amp = 0.5;
  for(int i = 0; i < 4; i++){
    v += amp * noise(p);
    p *= 2.02; amp *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;

  // base canvas colour, cool daylight paper #f7f5f9 (never pure #fff)
  vec3 base = vec3(0.969, 0.961, 0.976);

  // drifting fbm grain, agitated while unresolved and quiet once settled. The
  // whole field is inverted for paper: grain now SUBTRACTS, so it reads as fine
  // tooth in the sheet rather than luminous specks on black.
  float t = uTime * 0.06;
  float n = fbm(uv * vec2(uRes.x / uRes.y, 1.0) * 3.0 + t);
  float fine = hash(gl_FragCoord.xy + uTime * 60.0); // per-pixel static

  // amplitude collapses as we resolve; far lower than the dark build needed,
  // because texture on paper is legible at a fraction of the contrast
  float grainAmt = mix(0.055, 0.006, uResolve);
  float grain = (mix(n, fine, 0.4) - 0.5) * grainAmt;

  // violet wash rises from the lower-centre as signal emerges. On paper this is
  // a tint toward the accent, not added light: adding light to near-white just
  // clips to flat white and the gesture disappears.
  //
  // Amplitude dropped 0.16 -> 0.05 with the violet: the old sage sat near 35%
  // saturation and this accent is at 82%, so the same bloom strength stained
  // the whole hero purple instead of tinting the paper under the headline.
  vec2 c = uv - vec2(0.5, 0.42);
  c.x *= uAspect;
  float d = length(c);
  float bloom = smoothstep(0.8, 0.0, d) * 0.05 * uResolve;
  vec3 wash = vec3(0.427, 0.157, 0.851); // accent #6d28d9

  // faint vignette to seat the type. Inverted too: edges settle a touch DARKER
  // toward the paper's shadow, centre stays the brightest part of the sheet.
  float vig = smoothstep(1.15, 0.25, length(uv - 0.5));

  vec3 col = base - grain;
  col = mix(col, wash, bloom);
  col *= mix(0.965, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function NoiseField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  /** Bumped when the GPU takes the context away. Every WebGL object built
   *  below dies with the context, so the honest recovery is to re-run the whole
   *  effect rather than try to patch a program that no longer exists. */
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        antialias: false,
        // see the note at the top of this file: opaque means a canvas we never
        // draw to paints black over the paper, behind near-black type
        alpha: true,
        premultipliedAlpha: true,
      }) as WebGLRenderingContext | null) ?? null;
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uResolve = gl.getUniformLocation(prog, "uResolve");
    const uAspect = gl.getUniformLocation(prog, "uAspect");

    // non-null aliases so the closures below don't re-widen to `| null`
    const view = canvas;
    const ctx = gl;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Phones get the resolved frame and nothing else. A full-viewport 4-octave
    // fbm shader breathing forever is the single most expensive thing on the
    // page, and at 0.018 amplitude the breathing is invisible on a small
    // screen anyway, it costs a phone's frame budget to render a texture
    // nobody can see.
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches;

    /** The settled frame, drawn on demand. */
    function drawStatic() {
      ctx.uniform1f(uTime, 0);
      ctx.uniform1f(uResolve, 1);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    }

    function resize() {
      const w = view.clientWidth;
      const h = view.clientHeight;
      view.width = Math.max(1, Math.floor(w * dpr));
      view.height = Math.max(1, Math.floor(h * dpr));
      ctx.viewport(0, 0, view.width, view.height);
      ctx.uniform2f(uRes, view.width, view.height);
      ctx.uniform1f(uAspect, view.width / view.height);

      /* Assigning canvas.width/height CLEARS the drawing buffer. The animated
         path repaints on its next frame and never notices; the static path has
         no next frame, so without this redraw the canvas stays cleared.

         That is not a rare edge case on a phone: hiding or showing the address
         bar resizes the viewport, and this is the branch phones take. It is
         how the hero ended up as an empty field behind the headline. */
      if (reduce) drawStatic();
    }
    resize();
    window.addEventListener("resize", resize);
    /* Android and iOS report the address-bar collapse through visualViewport
       without always firing a window resize, so both are wired to the same
       handler. Duplicate calls are harmless, a missed one is not. */
    window.visualViewport?.addEventListener("resize", resize);

    // resolve 0 -> 1 over the intro; reduced-motion jumps straight to settled
    const start = performance.now();
    const RESOLVE_MS = 2400;
    // after the intro resolves, the grain only "breathes", half the frame
    // rate is indistinguishable at 0.018 amplitude and halves the GPU bill
    const SETTLED_FRAME_MS = 33;
    let raf = 0;
    let visible = true;
    let lastDraw = 0;

    function frame(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / RESOLVE_MS, 1);
      const settled = p >= 1;
      if (!settled || now - lastDraw >= SETTLED_FRAME_MS) {
        const resolve = 1 - Math.pow(1 - p, 3); // ease-out cubic
        ctx.uniform1f(uTime, elapsed / 1000);
        ctx.uniform1f(uResolve, resolve);
        ctx.drawArrays(ctx.TRIANGLES, 0, 3);
        lastDraw = now;
      }
      // keep a slow living grain after resolve; stop only when offscreen
      if (visible) raf = requestAnimationFrame(frame);
    }

    if (reduce) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    // pause the loop when the hero scrolls out of view
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible && !reduce) raf = requestAnimationFrame(frame);
        if (!visible) cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    /* preventDefault is what makes the context restorable at all; without it
       the browser never fires `webglcontextrestored`. A backgrounded tab on a
       phone is the common way to lose one. */
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
    };
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      io.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [generation]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
    />
  );
}
