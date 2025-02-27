import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

export default function Accordation(){
    return(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
          <AccordionTrigger>Product Details</AccordionTrigger>
          <AccordionContent>
           Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
          <AccordionTrigger>Vendor Details</AccordionTrigger>
          <AccordionContent>
           Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
           Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
          </AccordionItem>
          </Accordion>
    )
}