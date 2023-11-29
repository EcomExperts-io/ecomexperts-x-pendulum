import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useShippingAddress,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();

  return (
    <Banner title="canada-customer-alert">
      {translate('welcome', {target: extension.target})}
    </Banner>
  );
}