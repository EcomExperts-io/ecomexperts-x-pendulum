import {
  reactExtension,
  Banner
} from '@shopify/ui-extensions-react/checkout';

const thankYouPage = reactExtension(
  'purchase.thank-you.block.render',
  () => <Extension />,
);

export { thankYouPage };
function Extension() {
  const notificationText = "We are transitioning to a new operations system, so apologies if you receive duplicative shipment notifications from the team. You can reach out to our Customer Care team any time if there is any confusion.";
  return (
    <Banner
      status="critical"
      title={notificationText}
    />
  );
}