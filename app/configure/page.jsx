import Configurator from '../components/configurator/Configurator'

export const metadata = {
  title: 'Build Your Custom Bed | Get an Instant Quote',
  description:
    'Design your perfect handcrafted bed. Choose your size, fabric, colour and addons. Get an instant price from our UK factory. No sign up required.',
  alternates: {
    canonical: '/configure',
  },
}

export default function ConfigurePage() {
  return <Configurator />
}