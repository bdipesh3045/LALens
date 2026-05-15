/** LALens mark — file lives at `client/public/logo.png` (URL `/logo.png`). */
const LOGO_SRC = "/logo.png";

const VARIANT_CLASS = {
  nav: "brand-logo--nav",
  badge: "brand-logo--badge",
  feature: "brand-logo--feature",
  launcher: "brand-logo--launcher",
  "panel-title": "brand-logo--panel-title",
  footer: "brand-logo--footer",
  hero: "brand-logo--hero"
};

function BrandLogo({ variant = "nav", className = "", alt = "LALens", ...rest }) {
  const v = VARIANT_CLASS[variant] || VARIANT_CLASS.nav;
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      className={`brand-logo ${v} ${className}`.trim()}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  );
}

export default BrandLogo;
