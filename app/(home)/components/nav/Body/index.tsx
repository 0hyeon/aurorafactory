import { motion } from "framer-motion";
import Link from "next/link";
// import styles from "./style.module.scss";
import { blur, translate } from "../../anim";

export default function Body({
  links,
  selectedLink,
  setSelectedLink,
}: {
  links: any;
  selectedLink: any;
  setSelectedLink: any;
}) {
  const getChars = (word: string) => {
    let chars: any[] = [];
    word.split("").forEach((char, i) => {
      chars.push(
        <motion.span
          custom={[i * 0.02, (word.length - i) * 0.01]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
          key={char + i}
        >
          {char}
        </motion.span>
      );
    });
    return chars;
  };

  return (
    <div className="flex flex-wrap mt-[40px] pl-10">
      {links.map((link: { title: string; href: string }, index: number) => {
        const { title, href } = link;
        return (
          <Link key={`l_${index}`} href={href}>
            <motion.p
              className="
              m-0
              flex
              overflow-hidden
              text-4xl
              pr-[30px]
              pt-[10px]
              "
              onMouseOver={() => {
                setSelectedLink({ isActive: true, index });
              }}
              onMouseLeave={() => {
                setSelectedLink({ isActive: false, index });
              }}
              variants={blur}
              animate={
                selectedLink.isActive && selectedLink.index != index
                  ? "open"
                  : "closed"
              }
            >
              {getChars(title)}
            </motion.p>
          </Link>
        );
      })}
    </div>
  );
}
