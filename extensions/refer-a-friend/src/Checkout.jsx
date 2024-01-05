import {
  reactExtension,
  Link,
  Text,
  View,
  Heading,
  BlockSpacer
} from '@shopify/ui-extensions-react/checkout';


const thankYouPage = reactExtension(
  'purchase.thank-you.block.render',
  () => <Extension />,
);

export { thankYouPage };

function Extension() {
  return (
    <>
      <View padding="loose" border="base" borderWidth="medium" cornerRadius="base">
        <Heading level="2">Refer a friend</Heading>
        <BlockSpacer spacing="tight" />
        <Text>Share the wealth of good gut health—give 30% off, get 30% off.</Text>
        <BlockSpacer spacing="tight" />
        <Text>
          <Link to="https://pendulumlife.com/pages/referrals">Share now</Link>
        </Text>
      </View>
      <BlockSpacer spacing="loose" />
    </>
  );
}