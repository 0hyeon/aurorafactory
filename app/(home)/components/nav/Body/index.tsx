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
    <div className="h-[100vh] gap-5 flex items-center flex-col mt-[70px] md:mt-[40px]">
      {links.map((link: { title: string; href: string }, index: number) => {
        const { title, href } = link;
        return (
          <Link key={`l_${index}`} href={href}>
            <motion.p
              className="m-0 flex overflow-hidden text-2xl"
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
