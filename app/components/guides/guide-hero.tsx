import React from "react";
import Breadcrumb from "../common/breadcrumb";
import GuideAuthor from "./guide-author";
import GuideArticleSchema from "../schema/guide-article-schema";

type BlogHeroProps = {
  slug?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  image?: React.ReactNode;
  className?: string;
};

export default function GuideHero({
  slug,
  title,
  intro,
  image,
  className = "",
}: BlogHeroProps) {
  return (

    <section className={`mx-auto mt-4 mb-10 max-w-3xl px-6 ${className}`}>
       {slug ? <GuideArticleSchema slug={slug} /> : null}
       <Breadcrumb />

      <h1 className="text-4xl lg:text-5xl font-bold text-center">
        {title}
      </h1>
  <GuideAuthor />
      {intro && (
        <div className="mt-12 max-w-3xl mx-auto text-left text-gray-700 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mt-4">
            {intro}
        </div>
        )}

      

      {image && (
        <div className="mt-12 flex justify-center">
          {image}
        </div>
      )}
    </section>

  );
}

{/* 
    
    <BlogHero
              title=""
              intro={
                <>
                  <p>
                    
                  </p>
                </>
              }
              image={
                <figure className="max-w-3xl">
                  <img
                    src="/guides/"
                    alt=""
                    loading="lazy"
                    className="rounded-xl border"
                  />
                  <figcaption className="mt-2 text-sm text-gray-500 text-center">
                    
                  </figcaption>
                </figure>
              }
    />
    
    
    */}
