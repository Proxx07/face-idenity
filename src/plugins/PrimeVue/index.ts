import type { PrimeVueConfiguration } from 'primevue/config';
import { definePreset } from '@primeuix/styled';
import Aura from '@primeuix/themes/aura';
import { inputFieldPt } from '@/plugins/PrimeVue/input';
import { buttonConfig, buttonPt } from './button';

const customPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: 'var(--radius-s)',
      sm: 'var(--radius-m)',
      md: 'var(--radius-l)',
      lg: 'var(--radius-l)',
    },

    red: {
      50: 'rgb(255, 235, 232)',
      100: 'rgb(255, 210, 205)',
      200: 'rgb(255, 175, 166)',
      300: 'rgb(255, 135, 121)',
      400: 'rgb(255, 100, 82)',
      500: 'rgb(255, 65, 43)',
      600: 'rgb(230, 58, 38)',
      700: 'rgb(190, 48, 31)',
      800: 'rgb(150, 38, 24)',
      900: 'rgb(110, 28, 17)',
      950: 'rgb(70, 18, 10)',
    },

    green: {
      50: 'rgb(232, 250, 227)',
      100: 'rgb(208, 244, 199)',
      200: 'rgb(173, 234, 158)',
      300: 'rgb(138, 222, 116)',
      400: 'rgb(111, 213, 89)',
      500: 'rgb(90, 204, 62)',
      600: 'rgb(75, 180, 53)',
      700: 'rgb(60, 150, 42)',
      800: 'rgb(46, 120, 33)',
      900: 'rgb(31, 90, 23)',
      950: 'rgb(18, 60, 14)',
    },

    slate: {
      50: 'var(--secondary-50)',
      100: 'var(--secondary-100)',
      200: 'var(--secondary-200)',
      300: 'var(--secondary-300)',
      400: 'var(--secondary-400)',
      500: 'var(--secondary-500)',
      600: 'var(--secondary-600)',
      700: 'var(--secondary-700)',
      800: 'var(--secondary-800)',
      900: 'var(--secondary-900)',
      950: 'var(--secondary-950)',
    },
  },

  semantic: {
    primary: {
      50: 'var(--primary-50)',
      100: 'var(--primary-100)',
      200: 'var(--primary-200)',
      300: 'var(--primary-300)',
      400: 'var(--primary-400)',
      500: 'var(--primary-500)',
      600: 'var(--primary-600)',
      700: 'var(--primary-700)',
      800: 'var(--primary-800)',
      900: 'var(--primary-900)',
      950: 'var(--primary-950)',
    },

    formField: {
      paddingX: '1.6rem',
      paddingY: '2rem',
    },

    colorScheme: {
      light: {
        formField: {
          background: 'var(--secondary-500)',
          color: 'var(--black)',
          placeholderColor: 'var(--secondary-900)',
        },
      },

      dark: {
        formField: {
          background: '{zinc.900}',
          color: 'var(--white)',
          placeholderColor: 'var(--secondary-50)',
        },
      },
    },

    iconSize: '1.8rem',
  },

  components: {
    button: {
      colorScheme: {
        light: buttonConfig(),
        dark: buttonConfig(),
      },
    },
  },
});

export const options: PrimeVueConfiguration = {
  ripple: true,

  pt: {
    button(instance) {
      return buttonPt(instance);
    },

    inputtext: inputFieldPt(),
  },

  theme: {
    preset: customPreset,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
};
