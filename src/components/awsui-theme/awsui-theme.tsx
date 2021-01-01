import { ReactElement, ReactNode, useMemo } from 'react';
import {
  backgroundButtonNormalActiveVar,
  backgroundButtonNormalDefaultVar,
  backgroundButtonNormalHoverVar,
  backgroundContainerContentVar,
  backgroundContainerHeaderVar,
  backgroundControlCheckedVar,
  backgroundControlDefaultVar,
  backgroundControlDisabledVar,
  backgroundDropdownItemDefaultVar,
  backgroundDropdownItemFilterMatchVar,
  backgroundDropdownItemHoverVar,
  backgroundHomeHeaderVar,
  backgroundInputDefaultVar,
  backgroundInputDisabledVar,
  backgroundItemSelectedVar,
  backgroundLayoutMainVar,
  backgroundLayoutPanelContentVar,
  backgroundNotificationBlueVar,
  backgroundNotificationGreenVar,
  backgroundNotificationRedVar,
  backgroundStatusErrorVar,
  backgroundStatusInfoVar,
  backgroundStatusSuccessVar,
  backgroundStatusWarningVar,
  borderButtonNormalDefaultVar,
  borderButtonNormalHoverVar,
  borderContainerTopVar,
  borderControlDefaultVar,
  borderDividerDefaultVar,
  borderDropdownItemHoverVar,
  borderInputDefaultVar,
  borderItemFocusedVar,
  borderItemSelectedVar,
  borderStatusErrorVar,
  borderStatusInfoVar,
  borderStatusSuccessVar,
  borderStatusWarningVar,
  chartsStatusCriticalVar,
  chartsStatusHighVar,
  chartsStatusInfoVar,
  chartsStatusLowVar,
  chartsStatusMediumVar,
  chartsStatusNeutralVar,
  chartsStatusPositiveVar,
  chartsThresholdInfoVar,
  chartsThresholdNegativeVar,
  chartsThresholdNeutralVar,
  chartsThresholdPositiveVar,
  foregroundControlDefaultVar,
  foregroundControlDisabledVar,
  textAccentVar,
  textBodyDefaultVar,
  textBodySecondaryVar,
  textBreadcrumbVar,
  textDropdownItemFilterMatchVar,
  textDropdownItemHighlightedVar,
  textEmptyVar,
  textFormDefaultVar,
  textFormSecondaryVar,
  textHeadingDefaultVar,
  textHeadingSecondaryVar,
  textHomeHeaderDefaultVar,
  textHomeHeaderSecondaryVar,
  textInputDisabledVar,
  textInputPlaceholderVar,
  textInteractiveDefaultVar,
  textInteractiveDisabledVar,
  textInteractiveHoverVar,
  textLabelVar,
  textLinkDefaultVar,
  textNotificationDefaultVar,
  textStatusErrorVar,
  textStatusInactiveVar,
  textStatusInfoVar,
  textStatusSuccessVar,
} from './constants/design-token-vars';

interface Props {
  backgroundButtonNormalActive?: string;
  backgroundButtonNormalDefault?: string;
  backgroundButtonNormalHover?: string;
  backgroundContainerContent?: string;
  backgroundContainerHeader?: string;
  backgroundControlChecked?: string;
  backgroundControlDefault?: string;
  backgroundControlDisabled?: string;
  backgroundDropdownItemDefault?: string;
  backgroundDropdownItemFilterMatch?: string;
  backgroundDropdownItemHover?: string;
  backgroundHomeHeader?: string;
  backgroundInputDefault?: string;
  backgroundInputDisabled?: string;
  backgroundItemSelected?: string;
  backgroundLayoutMain?: string;
  backgroundLayoutPanelContent?: string;
  backgroundNotificationBlue?: string;
  backgroundNotificationGreen?: string;
  backgroundNotificationRed?: string;
  backgroundStatusError?: string;
  backgroundStatusInfo?: string;
  backgroundStatusSuccess?: string;
  backgroundStatusWarning?: string;
  borderButtonNormalDefault?: string;
  borderButtonNormalHover?: string;
  borderContainerTop?: string;
  borderControlDefault?: string;
  borderDividerDefault?: string;
  borderDropdownItemHover?: string;
  borderInputDefault?: string;
  borderItemFocused?: string;
  borderItemSelected?: string;
  borderStatusError?: string;
  borderStatusInfo?: string;
  borderStatusSuccess?: string;
  borderStatusWarning?: string;
  chartsStatusCritical?: string;
  chartsStatusHigh?: string;
  chartsStatusInfo?: string;
  chartsStatusLow?: string;
  chartsStatusMedium?: string;
  chartsStatusNeutral?: string;
  chartsStatusPositive?: string;
  chartsThresholdInfo?: string;
  chartsThresholdNegative?: string;
  chartsThresholdNeutral?: string;
  chartsThresholdPositive?: string;
  children: ReactNode;
  foregroundControlDefault?: string;
  foregroundControlDisabled?: string;
  textAccent?: string;
  textBodyDefault?: string;
  textBodySecondary?: string;
  textBreadcrumb?: string;
  textDropdownItemFilterMatch?: string;
  textDropdownItemHighlighted?: string;
  textEmpty?: string;
  textFormDefault?: string;
  textFormSecondary?: string;
  textHeadingDefault?: string;
  textHeadingSecondary?: string;
  textHomeHeaderDefault?: string;
  textHomeHeaderSecondary?: string;
  textInputDisabled?: string;
  textInputPlaceholder?: string;
  textInteractiveDefault?: string;
  textInteractiveDisabled?: string;
  textInteractiveHover?: string;
  textLabel?: string;
  textLinkDefault?: string;
  textNotificationDefault?: string;
  textStatusError?: string;
  textStatusInactive?: string;
  textStatusInfo?: string;
  textStatusSuccess?: string;
}

let instanceCount = 0;

export default function AwsuiTheme({
  backgroundButtonNormalActive,
  backgroundButtonNormalDefault,
  backgroundButtonNormalHover,
  backgroundContainerContent,
  backgroundContainerHeader,
  backgroundControlChecked,
  backgroundControlDefault,
  backgroundControlDisabled,
  backgroundDropdownItemDefault,
  backgroundDropdownItemFilterMatch,
  backgroundDropdownItemHover,
  backgroundHomeHeader,
  backgroundInputDefault,
  backgroundInputDisabled,
  backgroundItemSelected,
  backgroundLayoutMain,
  backgroundLayoutPanelContent,
  backgroundNotificationBlue,
  backgroundNotificationGreen,
  backgroundNotificationRed,
  backgroundStatusError,
  backgroundStatusInfo,
  backgroundStatusSuccess,
  backgroundStatusWarning,
  borderButtonNormalDefault,
  borderButtonNormalHover,
  borderContainerTop,
  borderControlDefault,
  borderDividerDefault,
  borderDropdownItemHover,
  borderInputDefault,
  borderItemFocused,
  borderItemSelected,
  borderStatusError,
  borderStatusInfo,
  borderStatusSuccess,
  borderStatusWarning,
  chartsStatusCritical,
  chartsStatusHigh,
  chartsStatusInfo,
  chartsStatusLow,
  chartsStatusMedium,
  chartsStatusNeutral,
  chartsStatusPositive,
  chartsThresholdInfo,
  chartsThresholdNegative,
  chartsThresholdNeutral,
  chartsThresholdPositive,
  children,
  foregroundControlDefault,
  foregroundControlDisabled,
  textAccent,
  textBodyDefault,
  textBodySecondary,
  textBreadcrumb,
  textDropdownItemFilterMatch,
  textDropdownItemHighlighted,
  textEmpty,
  textFormDefault,
  textFormSecondary,
  textHeadingDefault,
  textHeadingSecondary,
  textHomeHeaderDefault,
  textHomeHeaderSecondary,
  textInputDisabled,
  textInputPlaceholder,
  textInteractiveDefault,
  textInteractiveDisabled,
  textInteractiveHover,
  textLabel,
  textLinkDefault,
  textNotificationDefault,
  textStatusError,
  textStatusInactive,
  textStatusInfo,
  textStatusSuccess,
}: Props): ReactElement {
  const className: string = useMemo((): string => {
    instanceCount++;
    return `awsui-${instanceCount}-${Date.now().toString(36)}`;
  }, []);

  const css: string = useMemo((): string => {
    const vars: Record<string, string | undefined> = {
      [backgroundButtonNormalActiveVar]: backgroundButtonNormalActive,
      [backgroundButtonNormalDefaultVar]: backgroundButtonNormalDefault,
      [backgroundButtonNormalHoverVar]: backgroundButtonNormalHover,
      [backgroundContainerContentVar]: backgroundContainerContent,
      [backgroundContainerHeaderVar]: backgroundContainerHeader,
      [backgroundControlCheckedVar]: backgroundControlChecked,
      [backgroundControlDefaultVar]: backgroundControlDefault,
      [backgroundControlDisabledVar]: backgroundControlDisabled,
      [backgroundDropdownItemDefaultVar]: backgroundDropdownItemDefault,
      [backgroundDropdownItemFilterMatchVar]: backgroundDropdownItemFilterMatch,
      [backgroundDropdownItemHoverVar]: backgroundDropdownItemHover,
      [backgroundHomeHeaderVar]: backgroundHomeHeader,
      [backgroundInputDefaultVar]: backgroundInputDefault,
      [backgroundInputDisabledVar]: backgroundInputDisabled,
      [backgroundItemSelectedVar]: backgroundItemSelected,
      [backgroundLayoutMainVar]: backgroundLayoutMain,
      [backgroundLayoutPanelContentVar]: backgroundLayoutPanelContent,
      [backgroundNotificationBlueVar]: backgroundNotificationBlue,
      [backgroundNotificationGreenVar]: backgroundNotificationGreen,
      [backgroundNotificationRedVar]: backgroundNotificationRed,
      [backgroundStatusErrorVar]: backgroundStatusError,
      [backgroundStatusInfoVar]: backgroundStatusInfo,
      [backgroundStatusSuccessVar]: backgroundStatusSuccess,
      [backgroundStatusWarningVar]: backgroundStatusWarning,
      [borderButtonNormalDefaultVar]: borderButtonNormalDefault,
      [borderButtonNormalHoverVar]: borderButtonNormalHover,
      [borderContainerTopVar]: borderContainerTop,
      [borderControlDefaultVar]: borderControlDefault,
      [borderDividerDefaultVar]: borderDividerDefault,
      [borderDropdownItemHoverVar]: borderDropdownItemHover,
      [borderInputDefaultVar]: borderInputDefault,
      [borderItemFocusedVar]: borderItemFocused,
      [borderItemSelectedVar]: borderItemSelected,
      [borderStatusErrorVar]: borderStatusError,
      [borderStatusInfoVar]: borderStatusInfo,
      [borderStatusSuccessVar]: borderStatusSuccess,
      [borderStatusWarningVar]: borderStatusWarning,
      [chartsStatusCriticalVar]: chartsStatusCritical,
      [chartsStatusHighVar]: chartsStatusHigh,
      [chartsStatusInfoVar]: chartsStatusInfo,
      [chartsStatusLowVar]: chartsStatusLow,
      [chartsStatusMediumVar]: chartsStatusMedium,
      [chartsStatusNeutralVar]: chartsStatusNeutral,
      [chartsStatusPositiveVar]: chartsStatusPositive,
      [chartsThresholdInfoVar]: chartsThresholdInfo,
      [chartsThresholdNegativeVar]: chartsThresholdNegative,
      [chartsThresholdNeutralVar]: chartsThresholdNeutral,
      [chartsThresholdPositiveVar]: chartsThresholdPositive,
      [foregroundControlDefaultVar]: foregroundControlDefault,
      [foregroundControlDisabledVar]: foregroundControlDisabled,
      [textAccentVar]: textAccent,
      [textBodyDefaultVar]: textBodyDefault,
      [textBodySecondaryVar]: textBodySecondary,
      [textBreadcrumbVar]: textBreadcrumb,
      [textDropdownItemFilterMatchVar]: textDropdownItemFilterMatch,
      [textDropdownItemHighlightedVar]: textDropdownItemHighlighted,
      [textEmptyVar]: textEmpty,
      [textFormDefaultVar]: textFormDefault,
      [textFormSecondaryVar]: textFormSecondary,
      [textHeadingDefaultVar]: textHeadingDefault,
      [textHeadingSecondaryVar]: textHeadingSecondary,
      [textHomeHeaderDefaultVar]: textHomeHeaderDefault,
      [textHomeHeaderSecondaryVar]: textHomeHeaderSecondary,
      [textInputDisabledVar]: textInputDisabled,
      [textInputPlaceholderVar]: textInputPlaceholder,
      [textInteractiveDefaultVar]: textInteractiveDefault,
      [textInteractiveDisabledVar]: textInteractiveDisabled,
      [textInteractiveHoverVar]: textInteractiveHover,
      [textLabelVar]: textLabel,
      [textLinkDefaultVar]: textLinkDefault,
      [textNotificationDefaultVar]: textNotificationDefault,
      [textStatusErrorVar]: textStatusError,
      [textStatusInactiveVar]: textStatusInactive,
      [textStatusInfoVar]: textStatusInfo,
      [textStatusSuccessVar]: textStatusSuccess,
    };
    const attributes: string[] = [];
    for (const [varKey, value] of Object.entries(vars)) {
      if (typeof value !== 'undefined') {
        attributes.push(`${varKey}: ${value};`);
      }
    }
    return `
      .${className} {
        ${attributes.join('\n')};
      }
    `;
  }, [
    backgroundButtonNormalActive,
    backgroundButtonNormalDefault,
    backgroundButtonNormalHover,
    backgroundContainerContent,
    backgroundContainerHeader,
    backgroundControlChecked,
    backgroundControlDefault,
    backgroundControlDisabled,
    backgroundDropdownItemDefault,
    backgroundDropdownItemFilterMatch,
    backgroundDropdownItemHover,
    backgroundHomeHeader,
    backgroundInputDefault,
    backgroundInputDisabled,
    backgroundItemSelected,
    backgroundLayoutMain,
    backgroundLayoutPanelContent,
    backgroundNotificationBlue,
    backgroundNotificationGreen,
    backgroundNotificationRed,
    backgroundStatusError,
    backgroundStatusInfo,
    backgroundStatusSuccess,
    backgroundStatusWarning,
    borderButtonNormalDefault,
    borderButtonNormalHover,
    borderContainerTop,
    borderControlDefault,
    borderDividerDefault,
    borderDropdownItemHover,
    borderInputDefault,
    borderItemFocused,
    borderItemSelected,
    borderStatusError,
    borderStatusInfo,
    borderStatusSuccess,
    borderStatusWarning,
    chartsStatusCritical,
    chartsStatusHigh,
    chartsStatusInfo,
    chartsStatusLow,
    chartsStatusMedium,
    chartsStatusNeutral,
    chartsStatusPositive,
    chartsThresholdInfo,
    chartsThresholdNegative,
    chartsThresholdNeutral,
    chartsThresholdPositive,
    className,
    foregroundControlDefault,
    foregroundControlDisabled,
    textAccent,
    textBodyDefault,
    textBodySecondary,
    textBreadcrumb,
    textDropdownItemFilterMatch,
    textDropdownItemHighlighted,
    textEmpty,
    textFormDefault,
    textFormSecondary,
    textHeadingDefault,
    textHeadingSecondary,
    textHomeHeaderDefault,
    textHomeHeaderSecondary,
    textInputDisabled,
    textInputPlaceholder,
    textInteractiveDefault,
    textInteractiveDisabled,
    textInteractiveHover,
    textLabel,
    textLinkDefault,
    textNotificationDefault,
    textStatusError,
    textStatusInactive,
    textStatusInfo,
    textStatusSuccess,
  ]);

  return (
    <>
      <style type="text/css">{css}</style>
      <div className={className}>{children}</div>
    </>
  );
}
