import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccordionPage() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          Real-Time Data Tracking
        </AccordionTrigger>
        <AccordionContent className="text-[0.9rem] text-[#222] tracking-wide leading-6">
          Our system continuously monitors pandemics by collecting and updating
          data in real-time, covering metrics like case counts, mortality rates,
          and recovery rates from verified sources.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          User-Friendly Dashboard
        </AccordionTrigger>
        <AccordionContent className="text-[0.9rem] text-[#222] tracking-wide leading-6">
          Authenticated users can access an interactive dashboard that
          visualizes current trends, presents geographical data, and allows for
          comparisons across countries and continents.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          Public and Professional Accessibility
        </AccordionTrigger>
        <AccordionContent className="text-[0.9rem] text-[#222] tracking-wide leading-6">
          While core features like the dashboard require authentication,
          essential information is accessible to the public, making the platform
          a reliable information source for all.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
