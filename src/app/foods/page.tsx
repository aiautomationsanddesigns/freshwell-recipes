import type { Metadata } from "next";
import { FoodBrowserClient } from "./FoodBrowserClient";

export const metadata: Metadata = {
  title: "Browse Foods | Freshwell",
  description: "Explore Freshwell's traffic light food guide - green, amber, and red classified foods for a low carb lifestyle.",
};

export default function FoodsPage() {
  return <FoodBrowserClient />;
}
