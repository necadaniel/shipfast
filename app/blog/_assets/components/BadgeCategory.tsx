import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { categoryType } from "../content";

// This is the category badge that appears in the article page and in <CardArticle /> component
const Category = ({
  category,
  extraStyle,
}: {
  category: categoryType;
  extraStyle?: string;
}) => {
  return (
    <Link
      href={`/blog/category/${category.slug}`}
      title={`Posts in ${category.title}`}
      rel="tag"
    >
      <Badge 
        variant="secondary" 
        className={`hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-pointer ${
          extraStyle ? extraStyle : ""
        }`}
      >
        {category.titleShort}
      </Badge>
    </Link>
  );
};

export default Category;
