import {
  reactExtension,
  useDiscountCodes,
  Banner,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const discountCodes = useDiscountCodes();
  const customSetting = useSettings();
  let showMessage = false;
  for (var i = 0; i < discountCodes.length; ++i) {
    if (discountCodes[i].code.startsWith(customSetting.custom_starts_with)) {
      showMessage = true;
      break;
    }
  }
  if (showMessage) {
    return (
      <Banner
        status="info"
        title={customSetting.custom_dsc_msg}
      />
    );
  }
}