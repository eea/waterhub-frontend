import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Grid, Label } from 'semantic-ui-react';

const isSubmitting = (state) => Object.values(state.submitForm?.subrequests ?? {}).some((subrequest) => subrequest.loading);

const FriendlyCaptchaWidget = ({ sitekey, captchaToken, captchaRef, errorMessage }) => {
  const intl = useIntl();
  const container = useRef();
  const widget = useRef();
  const submitting = useSelector(isSubmitting);

  const reset = () => {
    captchaToken.current = null;
    widget.current?.reset();
  };

  // The Captcha wrapper is recreated on every form render, so expose reset()
  // through the current captchaRef each time.
  useEffect(() => {
    captchaRef.current = { reset };
  });

  useEffect(() => {
    let cancelled = false;
    import('friendly-challenge').then(({ WidgetInstance }) => {
      if (cancelled || !container.current) return;
      widget.current = new WidgetInstance(container.current, {
        sitekey,
        startMode: 'focus',
        language: intl.locale,
        doneCallback: (solution) => {
          captchaToken.current = solution;
        },
        errorCallback: () => {
          captchaToken.current = null;
        },
      });
    });
    return () => {
      cancelled = true;
      widget.current?.destroy();
      widget.current = undefined;
    };
  }, [sitekey, intl.locale, captchaToken]);

  // Friendly Captcha solutions can be verified only once, so a new puzzle is
  // needed as soon as the form has been sent, whatever the server answers.
  useEffect(() => {
    if (submitting) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitting]);

  return (
    <Grid.Row>
      <Grid.Column>
        <div ref={container} className="frc-captcha" />
        {errorMessage && (
          <Label basic color="red" className="form-error-label">
            {errorMessage}
          </Label>
        )}
      </Grid.Column>
    </Grid.Row>
  );
};

export default FriendlyCaptchaWidget;
