import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Divide2() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          High Infectivity
        </AccordionTrigger>
        <AccordionContent className="text-[1rem] text-[#222] tracking-wide leading-6">
          The disease exhibits high rates of infection, making it capable of
          rapid and wide dissemination.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          Significant Impact
        </AccordionTrigger>
        <AccordionContent className="text-[1rem] text-[#222] tracking-wide leading-6">
          It poses a severe threat to public health, including high mortality,
          strain on healthcare systems, or disruption of daily life and
          economies.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          Emerging Pathogen
        </AccordionTrigger>
        <AccordionContent className="text-[1rem] text-[#222] tracking-wide leading-6">
          Often caused by a new or previously unrecognized pathogen, leaving
          populations with little to no immunity.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
