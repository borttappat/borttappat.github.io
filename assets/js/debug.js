// Debug panel: live fps counter plus per-effect toggles.
// Settings are kept per browser, so a working combination sticks across reloads.
// Loaded in <head> so disabled effects apply before the first paint.
(function () {
    const KEY = 'debug-panel';

    // [id, label, css applied while the effect is off]
    const EFFECTS = [
        ['artjitter', 'art colour jitter', '.ascii-art{animation:none!important}'],
        ['flicker', 'flicker overlay', '.flicker{display:none!important}'],
        ['overlays', 'all overlays', '.scanlines,.scanline,.flicker,.crt-effects,.glow{display:none!important}'],
        ['pulse', 'clock/ip pulse', '#time,#ip-display{animation:none!important}'],
        ['linkflicker', 'link flicker', 'a{animation:none!important}'],
        ['glow', 'text glow', 'body,.ascii-art,a,#time,#ip-display{text-shadow:none!important}'],
        ['transition', 'link transitions', 'a{transition:none!important}'],
    ];

    function load() {
        try {
            return Object.assign({ open: false, off: [], nojs: false }, JSON.parse(localStorage.getItem(KEY)));
        } catch (e) {
            return { open: false, off: [], nojs: false };
        }
    }

    function save() {
        try {
            localStorage.setItem(KEY, JSON.stringify(state));
        } catch (e) {}
    }

    const state = load();
    const root = document.documentElement;

    // stop the fast glitch timers in effects.js (200ms clock/ip, 50ms hover); the 1s clock keeps running
    if (state.nojs) {
        const setIntervalOrig = window.setInterval;
        window.setInterval = (fn, ms, ...args) => (ms < 1000 ? 0 : setIntervalOrig(fn, ms, ...args));
    }

    const style = document.createElement('style');
    style.textContent = EFFECTS.map(([id, , css]) =>
        css.replace(/(^|\})([^{}]+)\{/g, (m, brace, sel) =>
            brace + sel.split(',').map(s => 'html.off-' + id + ' ' + s.trim()).join(',') + '{')
    ).join('\n');
    document.head.appendChild(style);
    state.off.forEach(id => root.classList.add('off-' + id));

    let panel = null;
    let running = false;

    function build() {
        panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML =
            '<div class="debug-fps">-- fps</div><div class="debug-worst">worst frame: -- ms</div>' +
            EFFECTS.map(([id, label]) =>
                `<label><input type="checkbox" data-id="${id}"${state.off.includes(id) ? ' checked' : ''}> ${label} off</label>`
            ).join('') +
            `<label><input type="checkbox" data-js${state.nojs ? ' checked' : ''}> js glitch timers off (reloads)</label>` +
            '<button type="button">reset</button>';

        panel.querySelectorAll('input[data-id]').forEach(cb => {
            cb.addEventListener('change', () => {
                root.classList.toggle('off-' + cb.dataset.id, cb.checked);
                state.off = state.off.filter(id => id !== cb.dataset.id);
                if (cb.checked) state.off.push(cb.dataset.id);
                save();
            });
        });
        panel.querySelector('input[data-js]').addEventListener('change', e => {
            state.nojs = e.target.checked;
            save();
            location.reload();
        });
        panel.querySelector('button').addEventListener('click', () => {
            state.off = [];
            state.nojs = false;
            save();
            location.reload();
        });
        document.body.appendChild(panel);
    }

    // rAF only runs while the panel is open, so the counter costs nothing otherwise
    function measure() {
        const fpsEl = panel.querySelector('.debug-fps');
        const worstEl = panel.querySelector('.debug-worst');
        let frames = 0, worst = 0, last = performance.now(), prev = last;
        running = true;
        (function tick(t) {
            if (!state.open) {
                running = false;
                return;
            }
            frames++;
            worst = Math.max(worst, t - prev);
            prev = t;
            if (t - last >= 1000) {
                fpsEl.textContent = Math.round(frames * 1000 / (t - last)) + ' fps';
                worstEl.textContent = 'worst frame: ' + worst.toFixed(0) + ' ms';
                frames = 0;
                worst = 0;
                last = t;
            }
            requestAnimationFrame(tick);
        })(last);
    }

    function show(open) {
        state.open = open;
        save();
        if (open && !panel) build();
        if (panel) panel.hidden = !open;
        if (open && !running) measure();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.getElementById('debug-toggle');
        if (toggle) {
            toggle.addEventListener('click', e => {
                e.preventDefault();
                show(!state.open);
            });
        }
        if (state.open) show(true);
    });
})();
