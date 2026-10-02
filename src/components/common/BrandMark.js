export default function BrandMark({ size = 36 }) {
 return <span aria-hidden="true" style={{
  display: 'inline-block', width: size, height: size, flexShrink: 0,
  backgroundColor: 'var(--brand, #e99516)',
  maskImage: 'url("/combee-logo.png")',
  maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
  WebkitMaskImage: 'url("/combee-logo.png")',
  WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center',
 }} />;
}
