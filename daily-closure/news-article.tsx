import { Card } from "$/common/components/card";
import { use, useEffect, useState } from "react";
import { currentDate } from "./utilities";
// import type { Post } from "./types";
import z from "zod";

type NewsArticleProps = {
  id: number;
};

const PostSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  body: z.string(),
  // authorEmail: z.email(),
  // published: z.coerce.boolean(),
  // tags: z.array(z.string()).default([]),
  // metadata: z.record(z.string(), z.unknown()),
});

// const IdSchema = z.union([z.string(), z.number(), z.null(), z.boolean()]);

type Post = z.infer<typeof PostSchema>;

// If you're trying to make schemas that validate the type,
// satisfies utility type will make sure that they match each other

// instead of importing Post type
// type Post = z.infer<typeof PostSchema>;

const fetchArticle = async (id: number): Promise<Post> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );
  const possiblePost = response.json();
  return PostSchema.parse(possiblePost);
};

export const NewsArticle = ({ id = 1 }: NewsArticleProps) => {
  // Important: The type for article is any because the API returns.

  // const [article, setArticle] = useState<any>(null);

  // useEffect(() => {
  //   fetchArticle(id).then((data) => setArticle(data));
  // }, [id]);

  const article = use(fetchArticle(id));

  return (
    <Card as="article" className="space-y-4 font-mono md:first:col-span-2">
      <header className="flex items-start justify-between">
        <h2 className="text-lg font-semibold">{article?.title}</h2>
        <p className="text-sm whitespace-nowrap text-gray-500">{currentDate}</p>
      </header>
      <p>{article?.body}</p>
    </Card>
  );
};
