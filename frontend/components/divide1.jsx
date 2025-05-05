import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Divide1() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          What Is a Pandemic?
        </AccordionTrigger>
        <AccordionContent className="text-[1rem] text-[#222] tracking-wide leading-6">
          A pandemic is a global outbreak of a disease that occurs when a new
          infectious agent, such as a virus or bacterium, spreads across
          multiple countries or continents, affecting a significant portion of
          the population.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          Global Spread
        </AccordionTrigger>
        <AccordionContent className="text-[1rem] text-[#222] tracking-wide leading-6">
          The disease spreads across multiple countries and continents,
          affecting a large number of people globally.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          Sustained Human-to-Human Transmission
        </AccordionTrigger>
        <AccordionContent className="text-[1rem] text-[#222] tracking-wide leading-6">
          There is consistent and ongoing transmission between humans, often
          bypassing geographic boundaries.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
