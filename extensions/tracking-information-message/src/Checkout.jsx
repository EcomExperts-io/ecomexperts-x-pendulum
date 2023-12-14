import {
  reactExtension,
  Link,
  Text,
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
      <Text>
       
        Once your order ships, you'll receive a confirmation with tracking
        information! {" "}
        <Text emphasis="bold">
          If you purchased a membership, make sure to {" "}
          <Link to="https://pendulumlife.com/account/register">
            register
          </Link>
          {" "}
          to be able to manage your account. {" "}
        </Text>
        Already have an account? {" "}
        <Text emphasis="bold">
        <Link to="https://pendulumlife.com/account/login">
            Login
        </Link>
        {" "}
        </Text>
        anytime.
        
      </Text>
      <BlockSpacer spacing="loose" />
    </>
  );
}