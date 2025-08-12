"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import { useState, useEffect } from "react";

interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface StrapiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// Strapi v5 Article format (direct properties, no attributes wrapper)
interface Article {
  id: number;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  cover?: StrapiImage;
  category?: StrapiCategory;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
}

interface TrendingArticleProps {
  data: {
    id?: number;
    heading?: string;
    description?: string;
    articles?: Article[];
  };
}

export default function TrendingArticle({ data }: TrendingArticleProps) {
  console.log("📈 TrendingArticle Component Loaded!");
  console.log("📈 TrendingArticle Data:", data);
  console.log("📰 Manually selected articles:", data.articles);
  console.log("📰 Number of selected articles:", data.articles?.length);
  
  // Simple debug render to see if component loads
  return (
    <section className="bg-yellow-100 py-16 border-2 border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">
          TrendingArticle Component Debug
        </h2>
        <p className="text-yellow-700">
          Component is rendering! Articles: {data.articles?.length || 0}
        </p>
        <div className="text-xs text-left bg-white p-4 mt-4 rounded overflow-auto max-h-96">
          <h3 className="font-bold mb-2">Data received:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </section>
  );
}
