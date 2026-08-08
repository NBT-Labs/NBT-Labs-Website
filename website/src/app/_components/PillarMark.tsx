type PillarMarkProps = {
  kind: "foundation" | "automation" | "ai";
};

export function PillarMark({ kind }: PillarMarkProps) {
  if (kind === "foundation") {
    return (
      <div
        className="pillar-logo pillar-logo-foundation"
        data-pillar-logo="foundation"
        aria-hidden="true"
      >
        <span className="foundation-orbit foundation-orbit-outer">
          <i />
          <i />
          <i />
        </span>
        <span className="foundation-orbit foundation-orbit-inner">
          <i />
          <i />
        </span>
        <span className="foundation-core">
          <i />
          <i />
          <i />
        </span>
      </div>
    );
  }

  if (kind === "automation") {
    return (
      <div
        className="pillar-logo pillar-logo-automation"
        data-pillar-logo="automation"
        aria-hidden="true"
      >
        <span className="automation-beam automation-beam-top"><i /></span>
        <span className="automation-beam automation-beam-right"><i /></span>
        <span className="automation-beam automation-beam-bottom"><i /></span>
        <span className="automation-beam automation-beam-left"><i /></span>
        <span className="automation-node automation-node-top" />
        <span className="automation-node automation-node-right" />
        <span className="automation-node automation-node-bottom" />
        <span className="automation-node automation-node-left" />
        <span className="automation-core"><i /></span>
      </div>
    );
  }

  return (
    <div
      className="pillar-logo pillar-logo-ai"
      data-pillar-logo="ai"
      aria-hidden="true"
    >
      <span className="ai-orbit ai-orbit-outer" />
      <span className="ai-orbit ai-orbit-middle" />
      <span className="ai-orbit ai-orbit-inner" />
      <span className="ai-node ai-node-one" />
      <span className="ai-node ai-node-two" />
      <span className="ai-node ai-node-three" />
      <span className="ai-node ai-node-four" />
      <span className="ai-node ai-node-five" />
      <span className="ai-node ai-node-six" />
      <span className="ai-core"><i /></span>
    </div>
  );
}
