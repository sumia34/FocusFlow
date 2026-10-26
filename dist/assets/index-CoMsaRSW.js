(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();function g(e,n){const t=e.trim(),c=n.trim();return!t||!c?"":`I chose “${c}” because it can help me make progress toward “${t}.”`}const y="focusflow.current-focus.v1",b=()=>({goal:"",task:"",connection:"",duration:25});function k(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)&&e.version===1&&typeof e.goal=="string"&&typeof e.task=="string"&&typeof e.connection=="string"}function m(e=globalThis.localStorage){const n=e.getItem(y);if(n===null)return b();let t;try{t=JSON.parse(n)}catch{throw new Error("Saved focus data is not valid JSON.")}if(!k(t))throw new Error("Saved focus data has an unsupported format.");return{goal:t.goal,task:t.task,connection:t.connection}}function w(e,n=globalThis.localStorage){m(n);const t={version:1,goal:e.goal,task:e.task,connection:e.connection};if(typeof t.goal!="string"||typeof t.task!="string"||typeof t.connection!="string")throw new TypeError("Focus details must be text.");return n.setItem(y,JSON.stringify(t)),{goal:t.goal,task:t.task,connection:t.connection}}function S(){const e=document.querySelector("#app");e.innerHTML=`
    <div class="page-shell">
      <header class="site-header">
        <a class="brand" href="#top" aria-label="FocusFlow home">
          <span class="brand-mark" aria-hidden="true">F</span>
          <span>FocusFlow</span>
        </a>
        <p class="header-note">A little progress, on purpose.</p>
      </header>

      <main id="top">
        <section class="intro" aria-labelledby="page-title">
          <p class="eyebrow">YOUR NEXT MEANINGFUL STEP</p>
          <h1 id="page-title">Make today count toward your bigger goal.</h1>
          <p class="intro-copy">
            Choose one manageable action, connect it to what matters, and give it your attention.
          </p>
        </section>

        <div class="workspace">
          <section class="planning-panel" aria-labelledby="planning-title">
            <div class="section-heading">
              <div>
                <p class="eyebrow">START WITH INTENTION</p>
                <h2 id="planning-title">Shape today's focus</h2>
              </div>
              <span class="step-mark" aria-hidden="true">01</span>
            </div>

            <div class="field-group">
              <label for="goal-input">Your long-term goal</label>
              <input
                id="goal-input"
                name="goal"
                type="text"
                required
                autocomplete="off"
                placeholder="e.g., Become a web developer"
                aria-describedby="goal-hint goal-error"
              />
              <p class="field-hint" id="goal-hint">Pick something that matters to you. It can change over time.</p>
              <p class="field-error" id="goal-error" hidden></p>
            </div>
            <div class="field-group">
  <label for="duration-input">How long will you focus?</label>
  <select id="duration-input" name="duration">
    <option value="15">15 minutes</option>
    <option value="25" selected>25 minutes</option>
    <option value="30">30 minutes</option>
    <option value="45">45 minutes</option>
  </select>
  <p class="field-hint">
    Choose a realistic amount of time for your task.
  </p>
</div>

            <div class="field-group">
              <label for="task-input">One task for today</label>
              <input
                id="task-input"
                name="task"
                type="text"
                required
                autocomplete="off"
                placeholder="e.g., Practise JavaScript functions"
                aria-describedby="task-hint task-error"
              />
              <p class="field-hint" id="task-hint">Make it specific and small enough to begin.</p>
              <p class="field-error" id="task-error" hidden></p>
            </div>

            <div class="connection-panel">
              <div class="connection-heading">
                <span class="connection-symbol" aria-hidden="true">↗</span>
                <div>
                  <h3>Why this step matters</h3>
                  <p id="connection-hint">A suggested connection will appear when both fields have text. Make it your own.</p>
                </div>
              </div>
              <label class="visually-hidden" for="connection-input">Editable connection between your task and goal</label>
              <textarea
                id="connection-input"
                name="connection"
                rows="3"
                required
                placeholder="Your goal and task will come together here."
                aria-describedby="connection-hint connection-error"
              ></textarea>
              <p class="field-error" id="connection-error" hidden></p>
            </div>
            <button class="primary-button" id="save-focus" type="button">Save today's focus</button>
            <p class="save-feedback" id="save-feedback" role="status" aria-live="polite"></p>
            <p class="privacy-note">Your focus timer is a preview; saved details stay in this browser.</p>
          </section>

          <aside class="support-column" aria-label="Focus and session history">
            <section class="timer-panel" aria-labelledby="timer-title">
              <div class="panel-topline">
                <p class="eyebrow">A MOMENT FOR YOURSELF</p>
                <span class="preview-tag">PREVIEW</span>
              </div>
              <h2 id="timer-title">Focus session</h2>
              <p class="timer-caption">A quiet space for one thing at a time.</p>
              <div class="timer-display" aria-label="Static timer preview, 25 minutes">25<span>:00</span></div>
              <p class="static-note">Timer controls are not active in this first step.</p>
            </section>

            <section class="history-panel" aria-labelledby="history-title">
              <div class="history-heading">
                <div>
                  <p class="eyebrow">LOOKING BACK</p>
                  <h2 id="history-title">Past sessions</h2>
                </div>
                <span class="history-count" aria-label="No saved sessions">0</span>
              </div>
              <p class="empty-history">No sessions saved yet. Your reflections will appear here.</p>
            </section>
          </aside>
        </div>
      </main>

      <footer class="site-footer">
        <span>Progress comes from meaningful steps, not perfect days.</span>
        <span class="footer-mark" aria-hidden="true">FOCUSFLOW / 01</span>
      </footer>
    </div>
  `;const n=e.querySelector("#goal-input"),t=e.querySelector("#task-input"),c=e.querySelector("#duration-input"),o=e.querySelector("#connection-input"),s=e.querySelector("#save-focus"),i=e.querySelector("#save-feedback"),d=[{input:n,error:e.querySelector("#goal-error"),message:"Enter a goal you’d like to work toward."},{input:t,error:e.querySelector("#task-error"),message:"Describe one specific task you want to work on."},{input:o,error:e.querySelector("#connection-error"),message:"Add a short explanation of how this task supports your goal."}];let u="",p=!0;function v(a,l=""){a.error.textContent=l,a.error.hidden=!l,a.input.setAttribute("aria-invalid",String(!!l))}try{const a=m();n.value=a.goal,t.value=a.task,o.value=a.connection,c.value=String(a.duration??25)}catch{p=!1,s.disabled=!0,i.textContent="Saved focus details could not be read. They were left unchanged, and saving is paused to protect them.",i.classList.add("is-error")}function f(){const a=g(n.value,t.value);(!o.value.trim()||o.value===u)&&(o.value=a,u=a)}p&&(u=g(n.value,t.value),f());function h(a,l){a.input.addEventListener("input",()=>{i.textContent="",i.classList.remove("is-error"),a.input.value.trim()&&v(a),l?.()})}h(d[0],f),h(d[1],f),h(d[2]),s.addEventListener("click",()=>{if(!p)return;i.textContent="",i.classList.remove("is-error");const a=d.find(r=>!r.input.value.trim());for(const r of d)v(r,r.input.value.trim()?"":r.message);if(a){a.input.focus();return}const l={goal:n.value.trim(),task:t.value.trim(),connection:o.value.trim(),duration:Number(c.value)};try{const r=w(l);n.value=r.goal,t.value=r.task,o.value=r.connection,u=g(r.goal,r.task),i.textContent="Today’s focus is saved in this browser."}catch{i.textContent="Focus could not be saved in this browser. Your entered details are still here.",i.classList.add("is-error")}})}S();
