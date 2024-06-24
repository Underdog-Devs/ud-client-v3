import React, { ReactNode } from "react";
import cx from "classnames";
import styles from "./Section.module.scss";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

const Section = ({ children, className, id }: Props) => (
  <section id={id}>
    <div className={cx(className, styles.contentContainer)}>{children}</div>
  </section>
);

export default Section;
