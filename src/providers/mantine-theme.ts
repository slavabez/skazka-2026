import type { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colors: {
    primary: [
      "#ccb3e6",
      "#bf9fdf",
      "#b28cd9",
      "#a679d2",
      "#7f40bf",
      "#7339ac",
      "#663399",
      "#592d86",
      "#4c2673",
      "#33194d",
    ],
    gradientFrom: [
      "#ccb3e6",
      "#bf9fdf",
      "#b28cd9",
      "#a679d2",
      "#7f40bf",
      "#7339ac",
      "#663399",
      "#592d86",
      "#4c2673",
      "#33194d",
    ],
    gradientTo: [
      "#ebaaee",
      "#e795e9",
      "#e280e5",
      "#dd6be1",
      "#d445d9",
      "#b927bf",
      "#a523a9",
      "#901e94",
      "#7c1a7f",
      "#521155",
    ],
  },
  primaryShade: 6,
  primaryColor: "primary",
  defaultRadius: "sm",
  defaultGradient: {
    deg: 270,
    to: "gradientTo",
    from: "gradientFrom",
  },
  components: {
    Button: {
      styles: {
        root: {
          borderWidth: 1,
        },
      },
    },
    Chip: {
      styles: {
        label: {
          borderWidth: 1,
        },
      },
    },
    Input: {
      styles: {
        input: {
          borderWidth: 1,
        },
      },
    },
    Pagination: {
      styles: {
        item: {
          borderWidth: 1,
        },
      },
    },
    Switch: {
      styles: {
        track: {
          borderWidth: 1,
        },
      },
    },
  },
  other: {
    customFontFamily: "Roboto",
  },
  fontFamily: "Roboto",
};
