document.addEventListener("DOMContentLoaded", function () {
  const checkElement = setInterval(() => {
    const commandDialog = document.querySelector(".quick-input-widget");
    if (commandDialog) {
      // Apply the blur effect immediately if the command dialog is visible
      if (commandDialog.style.display !== "none") {
        runMyScript();
      }
      // Create an DOM observer to 'listen' for changes in element's attribute.
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            if (commandDialog.style.display === "none") {
              handleEscape();
            } else {
              // If the .quick-input-widget element (command palette) is in the DOM
              // but no inline style display: none, show the backdrop blur.
              runMyScript();
            }
          }
        });
      });

      observer.observe(commandDialog, { attributes: true });

      // Clear the interval once the observer is set
      clearInterval(checkElement);
    } else {
      console.log("Command dialog not found yet. Retrying...");
    }
  }, 500); // Check every 500ms

  // Execute when command palette was launched.
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "p") {
      event.preventDefault();
      runMyScript();
    } else if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      handleEscape();
    }
  });

  // Ensure the escape key event listener is at the document level
  document.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        handleEscape();
      }
    },
    true,
  );

  function runMyScript() {
    const targetDiv = document.querySelector(".monaco-workbench");

    // Remove existing element if it already exists
    const existingElement = document.getElementById("command-blur");
    if (existingElement) {
      existingElement.remove();
    }

    // Create and configure the new element
    const newElement = document.createElement("div");
    newElement.setAttribute("id", "command-blur");

    newElement.addEventListener("click", function () {
      newElement.remove();
    });

    // Append the new element as a child of the targetDiv
    targetDiv.appendChild(newElement);
  }

  // Remove the backdrop blur from the DOM when esc key is pressed.
  function handleEscape() {
    const element = document.getElementById("command-blur");
    if (element) {
      element.click();
    }
  }
});

(() => {
  "use strict";
  var e = {
      820: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.CursorAnimation = void 0),
          (t.CursorAnimation = class {
            constructor(e) {
              (this._cursorCanvas = document.createElement("canvas")),
                (this._interval = null),
                (this._options = {
                  color: e?.color || "#ffffff",
                  cursorStyle: e?.cursorStyle || "block",
                  trailLength: e?.trailLength || 8,
                }),
                this.init();
            }
            updateOptions(e) {
              (this._options.color = e?.color || this._options.color),
                (this._options.cursorStyle =
                  e?.cursorStyle || this._options.cursorStyle),
                (this._options.trailLength =
                  e?.trailLength || this._options.trailLength);
            }
            destroy() {
              this._cursorHandle.stop(),
                (this._cursorHandle = null),
                this._cursorCanvas.remove(),
                this._interval && clearInterval(this._interval),
                (this._interval = null);
            }
            init() {
              this.createCursorHandler({
                onStarted: (e) => {
                  (this._cursorCanvas.style.pointerEvents = "none"),
                    (this._cursorCanvas.style.position = "absolute"),
                    (this._cursorCanvas.style.top = "0px"),
                    (this._cursorCanvas.style.left = "0px"),
                    (this._cursorCanvas.style.zIndex = "1000"),
                    e.appendChild(this._cursorCanvas),
                    (this._cursorHandle = this.createTrail({
                      length: this._options.trailLength,
                      color: this._options.color,
                      size: 7,
                      style: this._options.cursorStyle,
                      canvas: this._cursorCanvas,
                    }));
                },
                onReady: () => {},
                onCursorPositionUpdated: (e, t) => {
                  this._cursorHandle.move(e, t);
                },
                onEditorSizeUpdated: (e, t) => {
                  this._cursorHandle.updateSize(e, t);
                },
                onCursorSizeUpdated: (e, t) => {
                  this._cursorHandle.updateCursorSize(e, t);
                },
                onCursorVisibilityChanged: (e) => {
                  this._cursorCanvas.style.visibility = e
                    ? "visible"
                    : "hidden";
                },
                onLoop: () => {
                  this._cursorHandle.updateParticles();
                },
              });
            }
            createTrail(e) {
              const t = e?.canvas,
                o = t.getContext("2d");
              let n,
                i,
                s = { x: 0, y: 0 },
                r = [],
                a = e?.size || 3,
                l = e?.sizeY || 2.2 * a,
                c = !1;
              class d {
                constructor(e, t) {
                  this._position = { x: e, y: t };
                }
                get position() {
                  return this._position;
                }
              }
              function u(e, t) {
                r.push(new d(e, t));
              }
              const h = () => {
                  o.beginPath(),
                    (o.lineJoin = "round"),
                    (o.strokeStyle = this._options.color);
                  const e = Math.min(a, l);
                  o.lineWidth = e;
                  let t = (l - e) / 3;
                  for (let n = 0; n <= 3; n++) {
                    let i = n * t;
                    for (let t = 0; t < this._options.trailLength; t++) {
                      if (!r[t]) continue;
                      const n = r[t].position;
                      0 === t
                        ? o.moveTo(n.x, n.y + i + e / 2)
                        : o.lineTo(n.x, n.y + i + e / 2);
                    }
                  }
                  o.stroke();
                },
                m = () => {
                  o.beginPath(), (o.fillStyle = this._options.color);
                  for (let e = 0; e < this._options.trailLength; e++) {
                    if (!r[e]) continue;
                    const t = r[+e].position;
                    0 === e ? o.moveTo(t.x, t.y) : o.lineTo(t.x, t.y);
                  }
                  for (let e = this._options.trailLength - 1; e >= 0; e--) {
                    if (!r[e]) continue;
                    const t = r[+e].position;
                    o.lineTo(t.x, t.y + l);
                  }
                  o.closePath(),
                    o.fill(),
                    o.beginPath(),
                    (o.lineJoin = "round"),
                    (o.strokeStyle = this._options.color),
                    (o.lineWidth = Math.min(a, l));
                  let e = -a / 2 + l / 2;
                  for (let t = 0; t < this._options.trailLength; t++) {
                    if (!r[t]) continue;
                    const n = r[t].position;
                    0 === t ? o.moveTo(n.x, n.y + e) : o.lineTo(n.x, n.y + e);
                  }
                  o.stroke();
                };
              return {
                updateParticles: () => {
                  c &&
                    (o.clearRect(0, 0, n, i),
                    (function () {
                      let e = s.x,
                        t = s.y;
                      for (const o in r) {
                        const n = (r[+o + 1] || r[0]).position,
                          i = r[+o].position;
                        (i.x = e),
                          (i.y = t),
                          (e += 0.42 * (n.x - i.x)),
                          (t += 0.35 * (n.y - i.y));
                      }
                    })(),
                    "block" === this._options.cursorStyle ? m() : h());
                },
                move: (e, t) => {
                  if (((e += a / 2), (s.x = e), (s.y = t), !1 === c)) {
                    c = !0;
                    for (let o = 0; o < this._options.trailLength; o++) u(e, t);
                  }
                },
                updateSize: function (e, o) {
                  (n = e), (i = o), (t.width = e), (t.height = o);
                },
                updateCursorSize: function (e, t) {
                  (a = e), t && (l = t);
                },
                stop: function () {
                  (r = []), o.clearRect(0, 0, n, i);
                },
              };
            }
            async createCursorHandler(e) {
              let t = null;
              for (; !t; )
                await new Promise((e) => setTimeout(e, 100)),
                  (t = document.querySelector(".part.editor"));
              e?.onStarted(t);
              let o = [],
                n = 0,
                i = [],
                s = 0;
              function r(t, n, r, a) {
                let l,
                  c,
                  d = (a, u) => {
                    if (!i[n]) return void o.splice(o.indexOf(d), 1);
                    let { left: h, top: m } = t.getBoundingClientRect(),
                      p = h - a,
                      v = m - u;
                    (p === l && v === c && s === n) ||
                      ((l = p),
                      (c = v),
                      p <= 0 ||
                        v <= 0 ||
                        ("inherit" === t.style.visibility &&
                          (r.getBoundingClientRect().left > h ||
                            ((s = n),
                            e?.onCursorPositionUpdated(p, v),
                            e?.onCursorSizeUpdated(
                              t.clientWidth,
                              t.clientHeight,
                            )))));
                  };
                o.push(d);
              }
              let a = !1;
              this._interval = setInterval(async () => {
                let o = [],
                  s = 0;
                const l = t.querySelectorAll(".cursor");
                for (let e = 0; e < l.length; e++) {
                  const t = l[e];
                  if (
                    ("inherit" !== t.style.visibility && s++,
                    t.hasAttribute("cursorId"))
                  ) {
                    o.push(Number(t.getAttribute("cursorId")));
                    continue;
                  }
                  let a = n++;
                  o.push(a), (i[a] = t), t.setAttribute("cursorId", `${a}`);
                  let c = t.parentElement?.parentElement?.parentElement;
                  c?.parentElement?.querySelector(".minimap"), r(t, a, c);
                }
                let c = s <= 1;
                c !== a && (e?.onCursorVisibilityChanged(c), (a = c));
                for (const e in i) o.includes(+e) || delete i[+e];
              }, 500);
              const l = () => {
                if (!this._interval) return;
                let { left: n, top: i } = t.getBoundingClientRect();
                for (const e of o) e(n, i);
                e?.onLoop(), requestAnimationFrame(l);
              };
              function c() {
                e?.onEditorSizeUpdated(t.clientWidth, t.clientHeight);
              }
              new ResizeObserver(c).observe(t), c(), l(), e?.onReady();
            }
          });
      },
      327: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.addFocusHandler = t.FocusDimMode = void 0);
        let o = { onBlur: () => {}, onFocus: () => {} };
        var n;
        !(function (e) {
          (e.window = "Full Window"),
            (e.editor = "Everything But Editor"),
            (e.terminal = "Everything But Terminal"),
            (e.editorAndTerminal = "Everything But Editor and Terminal"),
            (e.none = "None");
        })(n || (t.FocusDimMode = n = {})),
          (t.addFocusHandler = function (e) {
            window.removeEventListener("blur", o.onBlur),
              window.removeEventListener("blur", o.onFocus);
            const t =
              ".minimap, .decorationsOverviewRuler, .composite.title, .title.tabs, .editor-container:has(.settings-editor)";
            let i = "";
            switch (e.mode) {
              case n.window:
                i = ".monaco-workbench";
                break;
              case n.editor:
                i = `.split-view-view:not(:has(.editor-instance > .monaco-editor, .editor-instance > .monaco-diff-editor)), .split-view-view:has(> .terminal-outer-container), ${t}`;
                break;
              case n.terminal:
                i = `.split-view-view:not(:has(.terminal)), ${t}`;
                break;
              case n.editorAndTerminal:
                i = `.split-view-view:not(:has(.editor-instance > .monaco-editor, .editor-instance > .monaco-diff-editor)):not(:has(.terminal)), ${t}`;
                break;
              case n.none:
                return;
            }
            const s = () => {
              let e = Array.from(document.querySelectorAll(i));
              return (
                (e = e.filter((t) => !e.some((e) => e.contains(t) && e !== t))),
                e
              );
            };
            s().forEach((t) => {
              t.style.transition = `opacity ${e.duration}ms`;
            }),
              (o.onBlur = () => {
                s().forEach((t) => {
                  t.style.opacity = `${e.amount}%`;
                });
              }),
              (o.onFocus = () => {
                s().forEach((e) => {
                  e.style.opacity = "100%";
                });
              }),
              window.addEventListener("blur", o.onBlur),
              window.addEventListener("focus", o.onFocus);
          });
      },
      530: (e, t, o) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.initTabsHandler = void 0);
        const n = o(888);
        t.initTabsHandler = function () {
          const e = new MutationObserver((e) => {
              const t = { added: null, removed: null, updated: [] };
              if (
                (e.forEach((e) => {
                  if (
                    "tabs-container" === e.target.className ||
                    "tabs-container" === e.target.parentElement?.className
                  )
                    if ("childList" === e.type) {
                      if (
                        (e.addedNodes.length > 0 && (t.added = e.addedNodes[0]),
                        e.removedNodes.length > 0 &&
                          !e.removedNodes[0].classList.contains("deletedTab"))
                      ) {
                        const o = e.removedNodes[0];
                        o.classList.add("deletedTab"), (t.removed = o);
                      }
                    } else if ("attributes" === e.type) {
                      if ("aria-label" !== e.attributeName) return;
                      if (e.oldValue === e.target.getAttribute("aria-label"))
                        return;
                      t.updated.push(e.target);
                    }
                }),
                0 !== t.updated.length || t.added || t.removed)
              )
                if (
                  (document
                    .querySelectorAll(".tabs-container > .tab")
                    .forEach((e) => {
                      e.classList.remove("newTab"),
                        e.classList.remove("moveLeft"),
                        e.classList.remove("moveRight"),
                        e.offsetWidth;
                    }),
                  t.added && t.updated.length > 0)
                ) {
                  t.updated[0].classList.add("newTab");
                  for (let e = 1; e < t.updated.length; e++)
                    t.updated[e].classList.add("moveRight");
                } else if (t.removed)
                  for (let e = 0; e < t.updated.length; e++)
                    t.updated[e].classList.add("moveLeft");
            }),
            t = {
              childList: !0,
              attributes: !0,
              attributeOldValue: !0,
              attributeFilter: ["aria-label"],
              subtree: !0,
            },
            o = new MutationObserver((o) => {
              o.forEach((o) => {
                "childList" === o.type &&
                  o.addedNodes.forEach((o) => {
                    const n = o.querySelector(".tabs-container")?.getRootNode();
                    e.observe(n, t);
                  });
              });
            });
          (0, n.waitForElements)(".split-view-container", (i) => {
            (0, n.waitForElements)(".tabs-container", (o) => {
              o.forEach((o) => {
                e.observe(o, t);
              });
            }),
              i.forEach((e) => {
                o.observe(e, { childList: !0 });
              });
          });
        };
      },
      888: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.waitForElements = t.waitForElement = void 0),
          (t.waitForElement = function (e, t, o = 10) {
            const n = setInterval(() => {
              const o = document.querySelector(e);
              o && (clearInterval(n), t(o));
            }, o);
          }),
          (t.waitForElements = function (e, t, o = 10) {
            const n = setInterval(() => {
              const o = document.querySelectorAll(e);
              o.length > 0 && (clearInterval(n), t(o));
            }, o);
          });
      },
      310: (e, t, o) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Messenger = void 0);
        const n = o(327);
        t.Messenger = class {
          constructor(e) {
            const t = setInterval(() => {
              this._messengerElement = document.getElementById(
                "BrandonKirbyson.vscode-animations",
              );
              const o = this._messengerElement?.getAttribute("aria-label");
              this._messengerElement &&
                "" !== o &&
                (clearInterval(t),
                e.onLoad(this.data),
                new MutationObserver((t) => {
                  t.forEach((t) => {
                    "attributes" === t.type &&
                      "aria-label" === t.attributeName &&
                      t.target.getAttribute("aria-label") &&
                      e.onUpdate(this.data);
                  });
                }).observe(this._messengerElement, { attributes: !0 }));
            }, 100);
          }
          get data() {
            const e = this._messengerElement?.getAttribute("aria-label"),
              t = {
                settings: {
                  cursorAnimation: {
                    enabled: !1,
                    color: "#ffffff",
                    cursorStyle: "line",
                    trailLength: 8,
                  },
                  focus: {
                    mode: n.FocusDimMode.window,
                    amount: 50,
                    duration: 200,
                  },
                },
                css: "",
              };
            if (!e) return t;
            return JSON.parse(e) || t;
          }
        };
      },
      882: (e, t) => {
        function o(e) {
          const o = document.createElement("style");
          (o.id = t.styleID),
            (o.textContent = e),
            document.body.insertAdjacentElement("afterbegin", o);
        }
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.updateCustomCSS = t.createCustomCSS = t.styleID = void 0),
          (t.styleID = "VSCode-Animations-custom-css"),
          (t.createCustomCSS = o),
          (t.updateCustomCSS = function (e) {
            const n = document.querySelector(`#${t.styleID}`);
            n ? n.textContent !== e && (n.textContent = e) : o(e);
          });
      },
    },
    t = {};
  function o(n) {
    var i = t[n];
    if (void 0 !== i) return i.exports;
    var s = (t[n] = { exports: {} });
    return e[n](s, s.exports, o), s.exports;
  }
  var n = {};
  (() => {
    var e = n;
    Object.defineProperty(e, "__esModule", { value: !0 });
    const t = o(820),
      i = o(327),
      s = o(530),
      r = o(310),
      a = o(882);
    console.log("VSCode-Animations: Successfully Installed!"),
      (() => {
        let e = null;
        new r.Messenger({
          onLoad: (o) => {
            (0, a.createCustomCSS)(o.css),
              (0, i.addFocusHandler)(o.settings.focus),
              o.settings.cursorAnimation.enabled &&
                (e = new t.CursorAnimation(o.settings.cursorAnimation));
          },
          onUpdate: (o) => {
            (0, a.updateCustomCSS)(o.css),
              (0, i.addFocusHandler)(o.settings.focus),
              o.settings.cursorAnimation.enabled
                ? (e || (e = new t.CursorAnimation(o.settings.cursorAnimation)),
                  e.updateOptions(o.settings.cursorAnimation))
                : (e && e.destroy(), (e = null));
          },
        }),
          (0, s.initTabsHandler)();
      })();
  })(),
    (module.exports = n);
})();
