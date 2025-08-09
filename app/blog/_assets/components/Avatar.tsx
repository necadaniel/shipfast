import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { articleType } from "../content";

// This is the author avatar that appears in the article page and in <CardArticle /> component
const AuthorAvatar = ({ article }: { article: articleType }) => {
  return (
    <Link
      href={`/blog/author/${article.author.slug}`}
      title={`Posts by ${article.author.name}`}
      className="inline-flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors"
      rel="author"
    >
      <span itemProp="author">
        <Avatar className="w-7 h-7">
          <AvatarImage
            src={article.author.avatar as string}
            alt={`Avatar of ${article.author.name}`}
          />
          <AvatarFallback className="bg-muted text-foreground text-sm">
            {article.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </span>
      <span className="group-hover:underline underline-offset-4">{article.author.name}</span>
    </Link>
  );
};

export default AuthorAvatar;
