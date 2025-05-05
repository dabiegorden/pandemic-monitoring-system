import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccordionPage2() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          Predictive Analytics
        </AccordionTrigger>
        <AccordionContent className="text-[0.9rem] text-[#222] tracking-wide leading-6">
          By using statistical models and historical data, our system offers
          predictions about potential pandemic trends. These predictions can
          help users anticipate and prepare for potential health crises.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          News and Alerts
        </AccordionTrigger>
        <AccordionContent className="text-[0.9rem] text-[#222] tracking-wide leading-6">
          Users receive regular news updates and alerts about current pandemic
          developments worldwide, helping them stay informed about critical
          health information.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-[1.1rem] text-black hover:no-underline">
          Real-time updates
        </AccordionTrigger>
        <AccordionContent className="text-[0.9rem] text-[#222] tracking-wide leading-6">
          Our system tracks the real-time pandemics updates and provide an
          insight to public health facilities to allow them make informed
          decision.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
