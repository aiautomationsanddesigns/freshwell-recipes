import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, BookOpen, Smartphone, FileText, CircleDot, Leaf, ArrowRight, Apple, Beef, Fish, Egg, Milk, Nut, Carrot, Wheat } from "lucide-react";

export const metadata: Metadata = {
  title: "Freshwell Guide | Freshwell",
  description: "Learn about the Freshwell Low Carb programme, traffic light food system, and resources.",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">The Freshwell Guide</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about the Freshwell Low Carb programme — the science,
            the food system, and how to get started.
          </p>
        </div>

        {/* What is Freshwell */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            What is Freshwell Low Carb?
          </h2>
          <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              The Freshwell Low Carb Project was started by <strong>Dr David Oliver</strong> and <strong>Dr Kim Andrews</strong>
              at the Freshwell Health Centre in Essex, UK. It grew from concerns about the rise in type 2 diabetes
              and obesity in the UK population.
            </p>
            <p>
              The approach is simple: reduce sugar to a minimum, avoid processed foods, and eat real,
              unprocessed food. The programme uses a <strong>traffic light system</strong> to make food
              choices easy to understand at a glance.
            </p>
            <p>
              The core principle is that excess sugar is converted to fat in the liver. By reducing carbohydrate
              intake and focusing on healthy fats, protein, and vegetables, the body can burn stored fat for energy instead.
            </p>
          </div>
        </section>

        {/* Traffic Light System */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">The Traffic Light System</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Green */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CircleDot className="h-6 w-6 text-emerald-600" />
                <h3 className="font-bold text-emerald-800">Green — Eat Freely</h3>
              </div>
              <ul className="text-sm text-emerald-900 space-y-1.5">
                <li className="flex items-center gap-2"><Beef className="h-3.5 w-3.5 flex-shrink-0" /> All meat: beef, pork, chicken, lamb, turkey, duck</li>
                <li className="flex items-center gap-2"><Fish className="h-3.5 w-3.5 flex-shrink-0" /> All fish: salmon, cod, mackerel, prawns, sardines</li>
                <li className="flex items-center gap-2"><Egg className="h-3.5 w-3.5 flex-shrink-0" /> Eggs (free range preferred)</li>
                <li className="flex items-center gap-2"><Milk className="h-3.5 w-3.5 flex-shrink-0" /> Full-fat dairy: butter, cheese, cream, yogurt</li>
                <li className="flex items-center gap-2"><Carrot className="h-3.5 w-3.5 flex-shrink-0" /> Above-ground vegetables: broccoli, spinach, peppers</li>
                <li className="flex items-center gap-2"><Nut className="h-3.5 w-3.5 flex-shrink-0" /> Nuts &amp; seeds: almonds, walnuts, chia, flax</li>
                <li>Healthy fats: olive oil, coconut oil, butter, ghee</li>
                <li>Water, tea, coffee (no sugar)</li>
              </ul>
            </div>
            {/* Amber */}
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CircleDot className="h-6 w-6 text-amber-600" />
                <h3 className="font-bold text-amber-800">Amber — In Moderation</h3>
              </div>
              <ul className="text-sm text-amber-900 space-y-1.5">
                <li className="flex items-center gap-2"><Apple className="h-3.5 w-3.5 flex-shrink-0" /> Berries: strawberries, blueberries, raspberries</li>
                <li>Some fruits: apples, pears (small portions)</li>
                <li>Root veg in small amounts: carrots, beetroot, swede</li>
                <li>Onions, tomatoes, garlic</li>
                <li>Legumes: peas, lentils, chickpeas</li>
                <li>Dark chocolate (85%+)</li>
                <li>Wine &amp; spirits (occasionally)</li>
                <li>Citrus: lemons, limes</li>
              </ul>
            </div>
            {/* Red */}
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CircleDot className="h-6 w-6 text-red-600" />
                <h3 className="font-bold text-red-800">Red — Avoid</h3>
              </div>
              <ul className="text-sm text-red-900 space-y-1.5">
                <li className="flex items-center gap-2"><Wheat className="h-3.5 w-3.5 flex-shrink-0" /> All bread (white, wholemeal, wraps)</li>
                <li>Pasta, rice, noodles, couscous</li>
                <li>Potatoes, sweet potatoes, chips</li>
                <li>Cereals, oats, porridge, flour</li>
                <li>Sugar, honey, sweets, biscuits, cakes</li>
                <li>Fizzy drinks, fruit juice, energy drinks</li>
                <li>Seed oils: rapeseed, sunflower, soya</li>
                <li>Margarine, processed foods, ready meals</li>
                <li>High-sugar fruit: bananas, grapes, mango</li>
                <li>Beer &amp; cider</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Principles */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Key Principles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">1. Cut Sugar</h3>
              <p className="text-sm text-gray-600">Excess sugar is converted straight to fat in the liver. Reducing sugar is the single biggest change you can make.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">2. Avoid Processed Foods</h3>
              <p className="text-sm text-gray-600">If it has a long ingredients list or comes in a packet, it&apos;s likely processed. Eat real food your grandmother would recognise.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">3. Don&apos;t Fear Fat</h3>
              <p className="text-sm text-gray-600">Natural fats (olive oil, butter, coconut oil) are healthy. Avoid seed oils (rapeseed, sunflower) which may cause inflammation.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">4. Avoid Snacking</h3>
              <p className="text-sm text-gray-600">Constant snacking keeps your body in energy-storage mode. Eat satisfying meals and let your body burn fat between them.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">5. Eat Real Food</h3>
              <p className="text-sm text-gray-600">Focus on meat, fish, eggs, vegetables, nuts, seeds, and full-fat dairy. These are nutrient-dense and keep you full.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">6. Stay Hydrated</h3>
              <p className="text-sm text-gray-600">Drink plenty of water. Tea and coffee (without sugar) are fine. Avoid sugary drinks and fruit juice.</p>
            </div>
          </div>
        </section>

        {/* RAG Foods Quick Reference */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Quick Reference: RAG Foods</h2>
            <Link
              href="/foods"
              className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:underline"
            >
              Browse all foods <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            RAG stands for Red, Amber, Green — the traffic light colours used to classify foods. Here are the most common items at a glance:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-2 px-3 font-semibold text-emerald-700">Green</th>
                  <th className="text-left py-2 px-3 font-semibold text-amber-700">Amber</th>
                  <th className="text-left py-2 px-3 font-semibold text-red-700">Red</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 px-3 font-medium text-gray-700">Protein</td>
                  <td className="py-2 px-3 text-gray-600">All meat, fish, eggs</td>
                  <td className="py-2 px-3 text-gray-600">Legumes</td>
                  <td className="py-2 px-3 text-gray-600">Processed meat (nuggets, fish fingers)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-gray-700">Dairy</td>
                  <td className="py-2 px-3 text-gray-600">Butter, cheese, cream, yogurt</td>
                  <td className="py-2 px-3 text-gray-600">Milk (large amounts)</td>
                  <td className="py-2 px-3 text-gray-600">—</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-gray-700">Vegetables</td>
                  <td className="py-2 px-3 text-gray-600">All above-ground veg</td>
                  <td className="py-2 px-3 text-gray-600">Root veg, onions, tomatoes</td>
                  <td className="py-2 px-3 text-gray-600">Potatoes, sweet potatoes</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-gray-700">Fruit</td>
                  <td className="py-2 px-3 text-gray-600">Avocado</td>
                  <td className="py-2 px-3 text-gray-600">Berries, apples, pears</td>
                  <td className="py-2 px-3 text-gray-600">Bananas, grapes, mango, dried fruit</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-gray-700">Fats</td>
                  <td className="py-2 px-3 text-gray-600">Olive oil, coconut oil, butter</td>
                  <td className="py-2 px-3 text-gray-600">—</td>
                  <td className="py-2 px-3 text-gray-600">Seed oils, margarine</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-gray-700">Carbs</td>
                  <td className="py-2 px-3 text-gray-600">—</td>
                  <td className="py-2 px-3 text-gray-600">—</td>
                  <td className="py-2 px-3 text-gray-600">Bread, pasta, rice, cereals, flour</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-gray-700">Drinks</td>
                  <td className="py-2 px-3 text-gray-600">Water, tea, coffee</td>
                  <td className="py-2 px-3 text-gray-600">Wine, spirits</td>
                  <td className="py-2 px-3 text-gray-600">Fizzy drinks, juice, beer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Resources */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Resources &amp; Links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResourceLink
              title="Freshwell Low Carb Project"
              description="The official Freshwell website with guides, videos, and the food scanner app."
              href="https://lowcarbfreshwell.com/"
              icon={<Leaf className="h-5 w-5" />}
            />
            <ResourceLink
              title="Freshwell Health Centre"
              description="The GP practice behind the programme — news, events, and low carb resources."
              href="https://www.freshwell.co.uk/"
              icon={<BookOpen className="h-5 w-5" />}
            />
            <ResourceLink
              title="Red, Amber, Green Guide (PDF)"
              description="Download the official Freshwell traffic light food classification poster."
              href="https://lowcarbfreshwell.com/going-low-carb/red-amber-green/"
              icon={<FileText className="h-5 w-5" />}
            />
            <ResourceLink
              title="Freshwell Food Scanner App"
              description="Free mobile app that scans food barcodes and gives a traffic light rating."
              href="https://lowcarbfreshwell.com/resources/freshwell-food-scanner-app/"
              icon={<Smartphone className="h-5 w-5" />}
            />
            <ResourceLink
              title="Meal Planners"
              description="Free 4-week rotating meal planners by Dr Kim Andrews, including vegetarian and budget options."
              href="https://lowcarbfreshwell.com/resources/meal-planners/"
              icon={<FileText className="h-5 w-5" />}
            />
            <ResourceLink
              title="Low Carb Education Programme"
              description="Video-based educational content covering the science and practice of low carb living."
              href="https://lowcarbfreshwell.com/"
              icon={<BookOpen className="h-5 w-5" />}
            />
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-400 py-4">
          <p>
            This app is for informational purposes only and is not affiliated with the Freshwell Health Centre.
            Always consult your GP or healthcare provider before making significant dietary changes, especially
            if you have diabetes or take medication.
          </p>
        </div>
      </main>
    </div>
  );
}

function ResourceLink({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 rounded-xl border border-gray-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
          {title}
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </a>
  );
}
