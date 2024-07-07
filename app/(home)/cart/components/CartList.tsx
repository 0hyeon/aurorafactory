// Import necessary modules and types
import { PrismaClient, Cart, productOption, Product } from "@prisma/client";
import { formatToWon } from "@/lib/utils";

const prisma = new PrismaClient();

interface CartListProps {
  data: Cart[];
}
interface CartWithProductOption extends Cart {
  option: ProductOptionWithProduct;
  basePrice: number;
  totalPrice: number;
}

// productOption 타입 확장
interface ProductOptionWithProduct extends productOption {
  product: Product;
}

// Fetch product options and their associated products
const fetchProductOptions = async (productOptionId: number) => {
  return await prisma.productOption.findUnique({
    where: { id: productOptionId },
    include: {
      product: true,
    },
  });
};

export default async function CartList({ data }: CartListProps) {
  // Fetch product options for all cart items
  const cartItems = await Promise.all(
    data.map(async (el) => {
      const productOption = await fetchProductOptions(el.productOptionId);
      if (!productOption) return null;

      // Calculate base price with product discount
      const basePrice =
        productOption.product.price *
        (1 - Number(productOption.product.discount || 0) / 100);

      // Apply additional discount if any to the base price
      let finalBasePrice = basePrice;
      if (productOption.plusdiscount && productOption.plusdiscount > 0) {
        // Calculate total discount percentage
        const totalDiscountPercentage =
          Number(productOption.product.discount || 0) / 100 +
          Number(productOption.plusdiscount) / 100;

        // Apply the total discount percentage to the base price
        finalBasePrice *= 1 - totalDiscountPercentage;
      }

      // Calculate total price for the option with quantity
      const totalPrice = finalBasePrice * el.quantity;

      return {
        ...el,
        option: productOption,
        basePrice: finalBasePrice,
        totalPrice,
      };
    })
  );

  const validCartItems = cartItems.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  // Calculate the total price for all cart items
  const totalPrice = validCartItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );
  console.log("validCartItems : ", validCartItems);
  return (
    <div className="flex flex-col gap-3">
      {validCartItems.map((item: CartWithProductOption) => (
        <div key={item.id} className="border-b border-b-gray-500">
          <div>상품명: {item.option.product.title}</div>
          <div>기본 가격: {formatToWon(item.option.product.price)}원</div>
          <div>기본 할인율: {item.option.product.discount}%</div>
          <div>기본 할인 적용 가격: {formatToWon(item.basePrice)}원</div>
          {item.option.plusdiscount && item.option.plusdiscount ? (
            <div>추가 할인율: {item.option.plusdiscount}%</div>
          ) : (
            ""
          )}
          <div>최종 가격: {formatToWon(item.totalPrice)}원</div>
          <div>색상: {item.option.color}</div>
          <div>수량: {item.quantity}</div>
        </div>
      ))}
      <div className="total-price">총 가격: {formatToWon(totalPrice)}원</div>
    </div>
  );
}
