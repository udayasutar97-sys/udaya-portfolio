"use client";

import {
  Monitor,
  Smartphone,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

type NoticeType =
  | "mobile"
  | "browser"
  | null;

function detectMobileDevice() {
  const userAgent =
    navigator.userAgent.toLowerCase();

  const mobileUserAgent =
    /android|iphone|ipad|ipod|mobile|windows phone/i.test(
      userAgent,
    );

  const narrowDisplay =
    window.innerWidth <= 900;

  const coarsePointer =
    window.matchMedia(
      "(pointer: coarse)",
    ).matches;

  return (
    mobileUserAgent ||
    (narrowDisplay && coarsePointer)
  );
}

function detectGoogleChrome() {
  const userAgent =
    navigator.userAgent;

  const containsChrome =
    /Chrome|CriOS/i.test(userAgent);

  const isEdge =
    /Edg|EdgiOS|EdgA/i.test(userAgent);

  const isOpera =
    /OPR|Opera/i.test(userAgent);

  const isSamsungBrowser =
    /SamsungBrowser/i.test(userAgent);

  const isFirefox =
    /Firefox|FxiOS/i.test(userAgent);

  return (
    containsChrome &&
    !isEdge &&
    !isOpera &&
    !isSamsungBrowser &&
    !isFirefox
  );
}

export default function ExperienceNotice() {
  const [
    noticeType,
    setNoticeType,
  ] = useState<NoticeType>(null);

  const [isVisible, setIsVisible] =
    useState(false);

  useEffect(() => {
    const isMobile =
      detectMobileDevice();

    const isChrome =
      detectGoogleChrome();

    if (isMobile) {
      setNoticeType("mobile");
      setIsVisible(true);
      return;
    }

    if (!isChrome) {
      setNoticeType("browser");
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      document.body.classList.remove(
        "experience-notice-active",
      );

      return;
    }

    document.body.classList.add(
      "experience-notice-active",
    );

    return () => {
      document.body.classList.remove(
        "experience-notice-active",
      );
    };
  }, [isVisible]);

  if (!isVisible || !noticeType) {
    return null;
  }

  const isMobileNotice =
    noticeType === "mobile";

  return (
    <>
      <div
        className="experience-notice-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-notice-title"
        aria-describedby="experience-notice-description"
      >
        <div className="experience-notice-panel">
          <div className="experience-notice-grid" />

          <button
            type="button"
            className="experience-notice-close"
            onClick={() =>
              setIsVisible(false)
            }
            aria-label="Close experience notice"
          >
            <X size={17} />
          </button>

          <div className="experience-notice-icon">
            {isMobileNotice ? (
              <Smartphone size={27} />
            ) : (
              <Monitor size={27} />
            )}
          </div>

          <p className="experience-notice-index">
            SYSTEM // EXPERIENCE ADVISORY
          </p>

          <h2 id="experience-notice-title">
            {isMobileNotice
              ? "DESKTOP EXPERIENCE RECOMMENDED"
              : "GOOGLE CHROME RECOMMENDED"}
          </h2>

          <p
            id="experience-notice-description"
            className="experience-notice-description"
          >
            {isMobileNotice
              ? "This portfolio uses advanced 3D graphics, interactive modules and complex motion effects. For the smoothest and complete experience, open it on a laptop or desktop using Google Chrome."
              : "This portfolio uses advanced WebGL graphics and complex motion effects. Google Chrome provides the smoothest and most complete experience."}
          </p>

          <div className="experience-notice-requirements">
            <span>
              <small>DISPLAY</small>
              {isMobileNotice
                ? "LAPTOP / DESKTOP"
                : "DESKTOP"}
            </span>

            <span>
              <small>BROWSER</small>
              GOOGLE CHROME
            </span>

            <span>
              <small>ACCESS</small>
              STILL AVAILABLE
            </span>
          </div>

          <button
            type="button"
            className="experience-notice-continue"
            onClick={() =>
              setIsVisible(false)
            }
          >
            CONTINUE ANYWAY
          </button>

          <p className="experience-notice-footer">
            You can continue using the site,
            but some animations may perform
            differently.
          </p>
        </div>
      </div>

      <style jsx global>{`
        body.experience-notice-active {
          overflow: hidden;
        }

        .experience-notice-overlay {
          position: fixed;
          inset: 0;
          z-index: 100000;

          padding: 20px;

          display: grid;
          place-items: center;

          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(55, 83, 174, 0.16),
              transparent 42%
            ),
            rgba(1, 4, 12, 0.82);

          backdrop-filter: blur(13px);
          -webkit-backdrop-filter: blur(13px);

          animation:
            experienceNoticeFadeIn
            0.35s ease both;
        }

        .experience-notice-panel {
          position: relative;

          width: min(520px, 100%);
          overflow: hidden;

          padding:
            clamp(28px, 4vw, 46px);

          color: #edf3ff;

          border: 1px solid
            rgba(120, 157, 235, 0.26);

          background:
            linear-gradient(
              145deg,
              rgba(9, 16, 35, 0.98),
              rgba(3, 7, 18, 0.98)
            );

          box-shadow:
            0 30px 100px
              rgba(0, 0, 0, 0.55),
            inset 0 0 70px
              rgba(74, 109, 218, 0.04);

          animation:
            experienceNoticeEnter
            0.55s
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;
        }

        .experience-notice-grid {
          position: absolute;
          inset: 0;

          pointer-events: none;

          opacity: 0.3;

          background-image:
            linear-gradient(
              rgba(
                  108,
                  145,
                  220,
                  0.055
                )
                1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(
                  108,
                  145,
                  220,
                  0.055
                )
                1px,
              transparent 1px
            );

          background-size: 34px 34px;
        }

        .experience-notice-close {
          position: absolute;
          z-index: 2;
          top: 15px;
          right: 15px;

          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          color: #7889a7;

          border: 1px solid
            rgba(116, 151, 221, 0.16);

          background: rgba(
            5,
            10,
            24,
            0.72
          );

          cursor: pointer;
        }

        .experience-notice-close:hover {
          color: #ffffff;

          border-color: rgba(
            130,
            171,
            255,
            0.46
          );
        }

        .experience-notice-icon {
          position: relative;
          z-index: 1;

          width: 58px;
          height: 58px;

          margin-bottom: 25px;

          display: grid;
          place-items: center;

          color: #8eabff;

          border: 1px solid
            rgba(129, 166, 255, 0.28);

          background: rgba(
            78,
            111,
            213,
            0.08
          );

          box-shadow:
            0 0 28px
              rgba(84, 124, 255, 0.12);
        }

        .experience-notice-index {
          position: relative;
          z-index: 1;

          margin:
            0
            0
            12px;

          color: #7083a3;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .experience-notice-panel h2 {
          position: relative;
          z-index: 1;

          margin: 0;

          max-width: 440px;

          font-size: clamp(
            29px,
            5vw,
            48px
          );

          font-weight: 500;
          line-height: 0.96;
          letter-spacing: -0.045em;
        }

        .experience-notice-description {
          position: relative;
          z-index: 1;

          margin:
            23px
            0
            0;

          max-width: 455px;

          color: #8a98af;

          font-size: 12px;
          line-height: 1.75;
        }

        .experience-notice-requirements {
          position: relative;
          z-index: 1;

          margin-top: 27px;

          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          border-top: 1px solid
            rgba(113, 149, 220, 0.15);

          border-bottom: 1px solid
            rgba(113, 149, 220, 0.15);
        }

        .experience-notice-requirements
          span {
          min-width: 0;

          padding:
            15px
            11px;

          display: flex;
          flex-direction: column;

          gap: 7px;

          color: #b6c3da;

          border-right: 1px solid
            rgba(113, 149, 220, 0.12);

          font-size: 6px;
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.11em;
        }

        .experience-notice-requirements
          span:last-child {
          border-right: 0;
        }

        .experience-notice-requirements
          small {
          color: #53637e;

          font-size: 5px;
          letter-spacing: 0.14em;
        }

        .experience-notice-continue {
          position: relative;
          z-index: 1;

          width: 100%;
          min-height: 54px;

          margin-top: 26px;

          color: #f1f5ff;

          border: 1px solid
            rgba(131, 169, 255, 0.32);

          background:
            linear-gradient(
              90deg,
              rgba(
                81,
                116,
                224,
                0.16
              ),
              rgba(
                55,
                81,
                168,
                0.06
              )
            );

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.17em;

          cursor: pointer;
        }

        .experience-notice-continue:hover {
          border-color: rgba(
            139,
            180,
            255,
            0.65
          );

          background:
            linear-gradient(
              90deg,
              rgba(
                84,
                123,
                238,
                0.24
              ),
              rgba(
                63,
                93,
                192,
                0.1
              )
            );
        }

        .experience-notice-footer {
          position: relative;
          z-index: 1;

          margin:
            13px
            0
            0;

          color: #536078;

          text-align: center;

          font-size: 6px;
          line-height: 1.6;
          letter-spacing: 0.08em;
        }

        @keyframes experienceNoticeFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes experienceNoticeEnter {
          from {
            opacity: 0;
            transform:
              translateY(25px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @media (max-width: 600px) {
          .experience-notice-overlay {
            padding: 12px;
          }

          .experience-notice-panel {
            padding:
              31px
              20px
              24px;
          }

          .experience-notice-panel h2 {
            padding-right: 25px;

            font-size: clamp(
              28px,
              9vw,
              39px
            );
          }

          .experience-notice-description {
            font-size: 11px;
          }

          .experience-notice-requirements {
            grid-template-columns: 1fr;
          }

          .experience-notice-requirements
            span {
            border-right: 0;

            border-bottom: 1px solid
              rgba(
                113,
                149,
                220,
                0.12
              );
          }

          .experience-notice-requirements
            span:last-child {
            border-bottom: 0;
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .experience-notice-overlay,
          .experience-notice-panel {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
