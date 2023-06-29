import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import WormholeBridge from "@wormhole-foundation/wormhole-connect";

export function WormholeConnect() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Accordion>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Section 1 title
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <WormholeBridge />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
