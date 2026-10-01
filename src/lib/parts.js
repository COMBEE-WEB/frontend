export const partCategories = [
 ['cpu','CPU'],['cpu_cooler','CPU 쿨러'],['gpu','GPU'],['memory','메모리'],
 ['storage','SSD / HDD'],['motherboard','메인보드'],['power_supply','파워'],['case','PC 케이스'],
 ['case_fan','케이스 팬'],['monitor','모니터'],['keyboard','키보드'],['mouse','마우스'],
 ['headphones','헤드폰'],['speaker','스피커'],['microphone','마이크'],['webcam','웹캠'],
 ['network_card','네트워크 카드'],['sound_card','사운드 카드'],['capture_card','캡처 카드'],
 ['laptop','노트북'],['prebuilt_desktop','완제품 PC'],['accessory','액세서리'],
 ['mousepad','마우스 패드'],['thermal_compound','서멀 컴파운드'],['lighting','조명'],
 ['stand','스탠드'],['chair','의자'],['desk','책상'],['os','운영체제'],['vr_headset','VR 헤드셋'],
].map(([id, name]) => ({ id, name }));

export function getPartCategory(id) {
 const canonical = { mainboard: 'motherboard', power: 'power_supply' }[id] || id;
 return partCategories.find((part) => part.id === canonical);
}
export function formatPrice(value) {
 return value == null ? '가격 정보 없음' : value.toLocaleString('ko-KR') + '원';
}
export async function fetchParts(path, signal) {
 const response = await fetch('/api/parts' + path, { signal, cache: 'no-store' });
 const data = await response.json();
 if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : '부품 정보를 불러오지 못했습니다.');
 return data;
}
