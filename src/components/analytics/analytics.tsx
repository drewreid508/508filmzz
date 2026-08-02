import Script from "next/script";

/**
 * Analytics loaders.
 *
 * Every provider is opt-in via an environment variable: with no ID set, the
 * component renders nothing and ships zero bytes. That keeps local dev and
 * preview deploys clean, and means a missing key can never break the build.
 *
 * All tags load with `afterInteractive` so they never block first paint —
 * these are measurement scripts, not render-critical ones.
 *
 * Required env vars (see .env.example):
 *   NEXT_PUBLIC_GA_ID           G-XXXXXXXXXX      Google Analytics 4
 *   NEXT_PUBLIC_GTM_ID          GTM-XXXXXXX       Google Tag Manager
 *   NEXT_PUBLIC_CLARITY_ID      xxxxxxxxxx        Microsoft Clarity
 *   NEXT_PUBLIC_META_PIXEL_ID   000000000000000   Meta Pixel
 *
 * Note: if you run GTM, configure GA4 *inside* GTM rather than also setting
 * NEXT_PUBLIC_GA_ID — running both double-counts every pageview.
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {ga && !gtm && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}

      {clarity && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${clarity}');`}
        </Script>
      )}

      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}

/**
 * GTM's <noscript> iframe. Must sit immediately after <body> opens, so it is a
 * separate export rather than part of <Analytics>.
 */
export function AnalyticsNoScript() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtm) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
