import Link from 'next/link';
import Image from 'next/image';
import { BrowseCategoryType, DataType } from '@/services/spotify';
import ItemsGrid from '@/components/ItemsGrid';
import styles from './BrowseCategories.module.scss';

interface Props {
  data: DataType<BrowseCategoryType> | null;
}

export default function BrowseCategories({ data }: Props) {
  return (
    <ItemsGrid>
      {data?.items.map((category) => {
        const imageData = category.icons[0];

        return (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className={styles.category}
          >
            <span className={styles.categoryName}>{category.name}</span>
            <Image
              src={imageData.url}
              fill
              sizes="100vw"
              alt=""
              className={styles.categoryImage}
            />
          </Link>
        );
      })}
    </ItemsGrid>
  );
}
