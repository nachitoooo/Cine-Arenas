// MovieCard.tsx
"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MovieCardProps {
  id: number;
  image: string | null;
  title: string;
  description: string;
}

export function MovieCard({ id, image, title, description }: MovieCardProps) {
  return (
    <div className="max-w-xs w-full">
      <Link href={`/select-seats/${id}`} legacyBehavior>
        <a>
          <div
            className={cn(
              "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
              "before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
              "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-30",
              "transition-all duration-500"
            )}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="text relative z-50">
              <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
                {title}
              </h1>
              <p className="font-normal text-base text-gray-50 relative my-4">
                {description}
              </p>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
