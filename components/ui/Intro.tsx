import { Logo } from "@/components/ui/Logo";

/* The once-per-session curtain: the mark, the ribbon drawing under it, then
   the panel lifts away (all of it `.intro` in globals.css). Server-rendered and
   inert from the first frame, so it never blocks a click or holds back the
   first paint underneath. The head script in the root layout marks repeat
   visits `data-intro="seen"`, which removes it before it can show. */
export function Intro() {
  return (
    <div aria-hidden className="intro">
      <div className="flex flex-col items-center">
        <Logo sizes="56px" className="h-14 w-auto" />
        <span className="intro__line" />
      </div>
    </div>
  );
}

/** Runs in <head> before the body parses. sessionStorage can throw (privacy
 *  modes), in which case the curtain is skipped rather than shown on every
 *  page. */
export const INTRO_SCRIPT = `try{var s=window.sessionStorage;if(s.getItem("sp-intro")){document.documentElement.dataset.intro="seen"}else{s.setItem("sp-intro","1")}}catch(e){document.documentElement.dataset.intro="seen"}`;
