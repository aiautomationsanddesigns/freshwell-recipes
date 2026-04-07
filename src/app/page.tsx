import Link from "next/link";
import { Leaf, ScanLine, ChefHat, UtensilsCrossed, ArrowRight, CircleDot } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-6">
              <Leaf className="h-4 w-4" />
              Based on the Freshwell Low Carb Programme
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Eat Well,{" "}
              <span className="text-emerald-600">Live Well</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl leading-relaxed">
              Build delicious low carb recipes using the Freshwell traffic light system.
              Browse foods by category, scan your fridge, and let AI generate
              recipes tailored to your ingredients.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/foods"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-emerald-700 transition-all hover:shadow-xl"
              >
                Browse Foods
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <ScanLine className="h-4 w-4" />
                Scan Your Fridge
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />
      </section>

      {/* Traffic Light Explainer */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">The Traffic Light System</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Freshwell uses a simple colour-coded system to guide your food choices
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CircleDot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-800">Green - Eat Freely</h3>
                  <p className="text-xs text-emerald-600">Enjoy as much as you like</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-emerald-900">
                <li>Meat, fish & eggs</li>
                <li>Full-fat dairy & cheese</li>
                <li>Above-ground vegetables</li>
                <li>Nuts, seeds & healthy fats</li>
                <li>Olive oil, butter & coconut oil</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                  <CircleDot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-800">Amber - In Moderation</h3>
                  <p className="text-xs text-amber-600">Enjoy occasionally in small amounts</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-amber-900">
                <li>Berries & some fruit</li>
                <li>Root vegetables (small amounts)</li>
                <li>Legumes (peas, beans, lentils)</li>
                <li>Dark chocolate (85%+)</li>
                <li>Wine & spirits (occasionally)</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                  <CircleDot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800">Red - Avoid</h3>
                  <p className="text-xs text-red-600">Try to avoid these foods</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-red-900">
                <li>Bread, pasta, rice & potatoes</li>
                <li>Cereals & sugar</li>
                <li>Fizzy drinks & fruit juice</li>
                <li>Processed foods</li>
                <li>Seed oils & margarine</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-500">Three simple steps to healthy low carb meals</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">1</span>
                <h3 className="text-lg font-semibold text-gray-900">Choose Your Foods</h3>
              </div>
              <p className="text-sm text-gray-500">
                Browse the food database, filter by traffic light colour and category,
                and select the ingredients you have or want to use.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <ScanLine className="h-8 w-8" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold">2</span>
                <h3 className="text-lg font-semibold text-gray-900">Or Scan Your Fridge</h3>
              </div>
              <p className="text-sm text-gray-500">
                Take a photo of your fridge and our AI will identify what you have,
                classify each item, and prepare your ingredient list automatically.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                <ChefHat className="h-8 w-8" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold">3</span>
                <h3 className="text-lg font-semibold text-gray-900">Get AI Recipes</h3>
              </div>
              <p className="text-sm text-gray-500">
                Choose breakfast, lunch, or dinner and our AI generates
                delicious Freshwell-compliant recipes using your selected ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-600">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Ready to eat better?</h2>
          <p className="text-emerald-100 text-lg">
            Start browsing foods and generating recipes now. No signup required.
          </p>
          <Link
            href="/foods"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 transition-all"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
