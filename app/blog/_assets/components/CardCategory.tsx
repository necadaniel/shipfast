import type { JSX } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { categoryType } from "../content";

// This is the category card that appears in the home page and in the category page
const CardCategory = ({
  category,
  tag = "h2",
}: {
  category: categoryType;
  tag?: keyof JSX.IntrinsicElements;
}) => {
  const TitleTag = tag;

  return (
    <Link
      href={`/blog/category/${category.slug}`}
      title={category.title}
      rel="tag"
      className="block"
    >
      <Card className="bg-muted text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors duration-200 cursor-pointer">
        <CardContent className="p-4">
          <TitleTag className="md:text-lg font-medium">
            {category?.titleShort || category.title}
          </TitleTag>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CardCategory;
