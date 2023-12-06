import React from "react";

import styles from "./categories.module.scss";
import Link from "next/link";
import HelpIcon from "@/icons/help";

const CategoryItem = ({ name, link, emoji }) => {
  return (
    <li className={styles.categoryItem}>
      <Link href={link || "/"}>
        <a>
          <span className={styles.emoji}>{emoji}</span>
          <span className={styles.categoryName}>{name}</span>
        </a>
      </Link>
    </li>
  );
};

export default function CategoriesBar() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Explore</h2>
      <ul className={styles.categories}>
        <CategoryItem name="新品介紹" emoji="⚡" link="/" />
        <CategoryItem name="食物" emoji="👚" link="/category/食物" />
        <CategoryItem name="拼貼" emoji="👠" link="/category/拼貼" />
        <CategoryItem
          name="Accessories"
          emoji="👜"
          link="/category/accessories"
        />
        <CategoryItem
          name="Activewear"
          emoji="🤸"
          link="/category/activewear"
        />
        <CategoryItem
          name="Gifts & Living"
          emoji="🎁"
          link="/category/gifts_and_living"
        />
        <CategoryItem
          name="Inspiration"
          emoji="💎"
          link="/category/inspiration"
        />
      </ul>
      <div className={styles.helpContainer}>
        <div className={styles.helpIcon}>
          <HelpIcon width={18} height={18} />
        </div>
        <span>Help Center</span>
      </div>
    </div>
  );
}
