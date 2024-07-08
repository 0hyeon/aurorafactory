import { Cart, productOption, Product } from "@prisma/client";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";

interface CartListProps {
  data: CartWithProductOption[];
}

interface CartWithProductOption extends Cart {
  option: ProductOptionWithProduct;
  basePrice: number;
  totalPrice: number;
}

// productOption 타입 확장
interface ProductOptionWithProduct extends productOption {
  product: Product & { photo: string | null };
}

export default function CartList({ data }: any) {
  console.log("cartList data : ", data);
  const totalPrice = data.reduce(
    (acc: any, item: any) => acc + item.totalPrice,
    0
  );

  return (
    <div className="flex flex-col gap-3">
      {data.map((item: CartWithProductOption) => (
        <div className="flex" key={item.id}>
          <div className="relative block w-28 h-28">
            {item.option.product.photo && (
              <Image
                src={`${item.option.product.photo}/public`}
                alt={item.option.product.photo}
                fill
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
          <div className="border-b border-b-gray-500">
            <div>상품명: {item.option.product.title}</div>
            <div>기본 가격: {formatToWon(item.option.product.price)}원</div>
            <div>기본 할인율: {item.option.product.discount}%</div>
            <div>기본 할인 적용 가격: {formatToWon(item.basePrice)}원</div>
            {item.option.plusdiscount ? (
              <div>추가 할인율: {item.option.plusdiscount}%</div>
            ) : null}
            <div>최종 가격: {formatToWon(item.totalPrice)}원</div>
            <div>색상: {item.option.color}</div>
            <div>수량: {item.quantity}</div>
          </div>
        </div>
      ))}
      <div className="total-price">총 가격: {formatToWon(totalPrice)}원</div>
    </div>
  );
}
