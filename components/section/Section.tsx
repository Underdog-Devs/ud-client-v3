import React, { ReactNode } from "react";
import cx from "classnames";
import styles from "./Section.module.scss";

type Props = {
  children: ReactNode;
  outerStyles?: string;
  className?: string;
  id?: string;
};

const Section = ({ outerStyles, children, className, id }: Props) => (
  <section className={outerStyles} id={id}>
    <div className={cx(className, styles.contentContainer)}>{children}</div>
  </section>
);

export default Section;
