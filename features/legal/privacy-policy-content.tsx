export const PrivacyPolicyContent = () => {
  return (
    <>
      <section>
        <p>
          JobSeeker AI (&quot;we,&quot; &quot;us,&quot; or &quot;the
          Service&quot;) helps you analyze your resume and match it against
          job openings using AI. This policy explains what information we
          collect, why we collect it, who we share it with, and the choices
          you have.
        </p>
      </section>

      <section>
        <h2>1. Information we collect</h2>
        <p>
          <strong>Account information.</strong> When you sign up, we collect
          your name, email address, and password. Passwords are handled
          entirely by our authentication provider, Supabase — we never see or
          store your password ourselves.
        </p>
        <p>
          <strong>Resume data.</strong> When you upload a resume, we store
          the original PDF file and the text extracted from it. The most
          recently uploaded resume becomes your &quot;active&quot; resume,
          used for job matching.
        </p>
        <p>
          <strong>Job search &amp; matching data.</strong> Job titles and
          locations you search for, and the AI-generated match scores,
          summaries, and analysis produced for your resume.
        </p>
        <p>
          <strong>Technical data.</strong> Your IP address is processed
          transiently to enforce rate limits and prevent abuse (e.g. brute
          force login attempts). We also use Vercel Analytics for aggregate,
          privacy-respecting usage statistics (e.g. which pages are visited);
          this does not use tracking cookies.
        </p>
      </section>

      <section>
        <h2>2. How we use your information</h2>
        <ul>
          <li>To create and secure your account, and verify your identity</li>
          <li>To store and let you manage your resumes (view, download, delete)</li>
          <li>To extract, analyze, and score your resume against job descriptions using AI</li>
          <li>To search for and return relevant job listings</li>
          <li>To detect and prevent abuse, fraud, and security incidents</li>
          <li>To send you transactional emails (e.g. password reset links)</li>
          <li>To maintain and improve the Service</li>
        </ul>
      </section>

      <section>
        <h2>3. AI processing of your resume</h2>
        <p>
          To generate match scores, summaries, and improvement suggestions,
          the text extracted from your resume — and the job descriptions you
          analyze it against — are sent to OpenAI&apos;s API for processing.
          We do not control OpenAI&apos;s further use of this data beyond
          what their API terms permit; review{" "}
          <a
            href="https://openai.com/policies/api-data-usage-policies"
            target="_blank"
            rel="noreferrer"
          >
            OpenAI&apos;s API data usage policy
          </a>{" "}
          for details. Do not upload a resume containing information you are
          not comfortable sharing with our AI processing provider.
        </p>
      </section>

      <section>
        <h2>4. Third-party service providers</h2>
        <p>We rely on the following providers to operate the Service:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — authentication, database, and file
            storage for your account and resumes
          </li>
          <li>
            <strong>OpenAI</strong> — AI-powered resume analysis and job
            matching
          </li>
          <li>
            <strong>[Jobs API provider name]</strong> — live job listing
            search results
          </li>
          <li>
            <strong>Vercel</strong> — application hosting and aggregate
            usage analytics
          </li>
        </ul>
        <p>
          Each provider processes data only as needed to provide their part
          of the Service, under their own privacy and security terms.
        </p>
      </section>

      <section>
        <h2>5. Data storage &amp; security</h2>
        <p>
          Resume files are stored in a private storage bucket that only your
          account can access. All traffic to and from the Service is
          encrypted in transit (HTTPS). Access to job-search and
          authentication endpoints is rate-limited to reduce abuse. No
          method of storage or transmission is 100% secure, and we cannot
          guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>6. Data retention</h2>
        <p>
          We retain your resumes until you delete them, and your account
          information for as long as your account remains active. You can
          delete individual resumes at any time from the &quot;My
          resumes&quot; page. [If full account deletion is not yet
          available, replace this sentence once it is — until then, contact
          us at the email below to request full account and data deletion.]
        </p>
      </section>

      <section>
        <h2>7. Your rights &amp; choices</h2>
        <ul>
          <li>View, download, and delete any resume you&apos;ve uploaded</li>
          <li>Set which resume is &quot;active&quot; for job matching</li>
          <li>Request a copy of the personal data we hold about you</li>
          <li>Request deletion of your account and associated data</li>
          <li>Correct inaccurate account information</li>
        </ul>
        <p>
          To exercise any of these rights beyond what&apos;s available in
          the product, contact us using the details below.
        </p>
      </section>

      <section>
        <h2>8. Cookies &amp; local storage</h2>
        <p>
          We use your browser&apos;s local storage (not cookies) to keep you
          signed in between visits. Vercel Analytics does not use tracking
          cookies. We do not use third-party advertising trackers.
        </p>
      </section>

      <section>
        <h2>9. Children&apos;s privacy</h2>
        <p>
          The Service is not directed to children under 16, and we do not
          knowingly collect personal information from them.
        </p>
      </section>

      <section>
        <h2>10. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. If we make material
          changes, we&apos;ll update the &quot;Last updated&quot; date above
          and, where appropriate, notify you directly.
        </p>
      </section>

      <section>
        <h2>11. Contact us</h2>
        <p>
          Questions about this policy or your data? Contact us at{" "}
          <a href="mailto:[contact@example.com]">[contact@example.com]</a>.
        </p>
      </section>
    </>
  );
};
