import PartComments from "./PartComments";
import styles from "./PartListDetail.module.css";

//-------------------
// 선택한 제품의 상세 정보 팝업 표시
//-------------------
export default function PartDetailModal({ product, onClose })
{
    return (
        <div
            className={styles.modalBackdrop}
            role="presentation"
            onClick={onClose}
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="part-detail-title"
                onClick={
                    (event) =>
                    {
                        event.stopPropagation();
                    }
                }
            >
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="상세 창 닫기"
                >
                    ×
                </button>

                <div className={styles.productDetail}>
                    <div className={styles.productImage}>
                        제품 이미지
                    </div>

                    <h2 id="part-detail-title">
                        {product.name}
                    </h2>

                    <dl className={styles.specification}>
                        <dt>소켓</dt>
                        <dd>{product.socket}</dd>

                        <dt>코어</dt>
                        <dd>{product.core}</dd>

                        <dt>스레드</dt>
                        <dd>{product.thread}</dd>

                        <dt>클럭</dt>
                        <dd>{product.clock}</dd>

                        <dt>내장 그래픽</dt>
                        <dd>{product.internalGraphics}</dd>
                    </dl>
                </div>

                <PartComments productId={product.id} />
            </section>
        </div>
    );
}
