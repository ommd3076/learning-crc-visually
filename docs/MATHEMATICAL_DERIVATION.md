# Comprehensive Mathematical Derivation: CRC-16 / CCITT

$$\mathbb{F}_2[x] \quad \text{Galois Field Polynomial Ring Algebra}$$

This document provides the formal mathematical proofs and algebraic foundations underlying Cyclic Redundancy Check (CRC), specifically the **CRC-16-CCITT** standard ($x^{16} + x^{12} + x^5 + 1$) implemented in the video explainer.

---

## 1. Algebraic Setting: The Field $\mathbb{F}_2$

The Galois Field with two elements, denoted $\mathbb{F}_2$ or $\text{GF}(2)$, consists of the set $\{0, 1\}$ equipped with arithmetic operations modulo 2:

### Axioms
1. **Addition**:
   $$0 + 0 = 0, \quad 0 + 1 = 1, \quad 1 + 0 = 1, \quad 1 + 1 = 0$$
   This is mathematically identical to the bitwise Exclusive-OR ($\oplus$) operator.

2. **Additive Inverses**:
   Since $1 + 1 = 0$, every element is its own additive inverse:
   $$-a \equiv a \pmod 2 \implies a - b \equiv a + b \equiv a \oplus b$$
   Subtraction and addition are completely isomorphic.

3. **Absence of Carries and Borrows**:
   Because coefficient addition operates strictly within $\mathbb{F}_2$, operations on polynomial rings $\mathbb{F}_2[x]$ involve zero cross-column propagation. Every power $x^k$ is algebraically independent.

---

## 2. Polynomial Formulation of the Laboratory Data

Let the original dataword payload be $D = \texttt{1101011011}_2$ (length $k = 10$ bits).

We map these bits to a polynomial $D(x) \in \mathbb{F}_2[x]$ where each bit represents the coefficient of power $x^{k - 1 - i}$:

$$D(x) = 1\cdot x^9 + 1\cdot x^8 + 0\cdot x^7 + 1\cdot x^6 + 0\cdot x^5 + 1\cdot x^4 + 1\cdot x^3 + 0\cdot x^2 + 1\cdot x^1 + 1\cdot x^0$$
$$D(x) = x^9 + x^8 + x^6 + x^4 + x^3 + x + 1$$

---

## 3. The Generator Polynomial $G(x)$

The CRC-16-CCITT standard selects the primitive-based generator polynomial of degree $r = 16$:

$$G(x) = x^{16} + x^{12} + x^5 + 1$$

In bit-vector representation ($r + 1 = 17$ bits):
$$\texttt{1 0 0 0 1 0 0 0 0 0 0 1 0 0 0 0 1}_2$$

### Properties of $G(x)$:
1. **Contains factor $(x + 1)$**: Detects all error bursts with an odd number of inverted bits.
2. **Degree $r = 16$**: Guarantees 100% detection of all single burst errors of length $L \le 16$.
3. **Double-bit Error Detection**: Detects all double-bit errors separated by a distance less than the cycle length $2^{15} - 1 = 32767$ bits.

---

## 4. The Augmentation and Division Theorem

To reserve $r = 16$ check bits, the sender multiplies $D(x)$ by $x^r$:

$$D_{\text{aug}}(x) = D(x) \cdot x^{16}$$

In binary, this appends 16 zeros to the payload:
$$D_{\text{aug}} = \texttt{1101011011 0000000000000000}_2 \quad (26\text{ bits})$$

By the Polynomial Division Algorithm in $\mathbb{F}_2[x]$, there exist unique polynomials $Q(x)$ (quotient) and $R(x)$ (remainder) such that:

$$D(x) \cdot x^{16} = Q(x) \cdot G(x) \oplus R(x), \quad \text{where } \deg(R) < 16$$

### Exact Laboratory Solution:
$$\text{Quotient: } Q(x) = x^9 + x^8 + x^6 + x^4 + x^3 + x + 1 = \texttt{1101101101}_2$$
$$\text{Remainder: } R(x) = \texttt{1011111011001101}_2$$

---

## 5. Construction of the Transmitted Codeword $T(x)$

The sender constructs the transmitted codeword by appending the remainder $R(x)$ into the augmented slots:

$$T(x) = D(x) \cdot x^{16} \oplus R(x)$$
$$T = \texttt{1101011011 1011111011001101}_2 \quad (26\text{ bits})$$

### The Clean Invariant Theorem:
Because $D(x) \cdot x^{16} \oplus R(x) = Q(x) \cdot G(x)$, the transmitted polynomial $T(x)$ is an **exact algebraic multiple** of $G(x)$:

$$T(x) = Q(x) \cdot G(x)$$

---

## 6. Receiver Verification & Syndrome Decoding

Let the channel introduce an additive error polynomial $E(x) \in \mathbb{F}_2[x]$:

$$T'(x) = T(x) \oplus E(x)$$

The receiver computes the syndrome polynomial $S(x)$ by dividing $T'(x)$ by $G(x)$:

$$S(x) = T'(x) \pmod{G(x)} = \big(T(x) \oplus E(x)\big) \pmod{G(x)}$$

Using linearity of the modulo operation:

$$S(x) = \big(T(x) \pmod{G(x)}\big) \oplus \big(E(x) \pmod{G(x)}\big)$$

Since $T(x) \pmod{G(x)} = 0$:

$$S(x) = E(x) \pmod{G(x)}$$

### Decision Rule:
1. **$S(x) = 0$**: No detectable error occurred ($E(x) = 0$ or $E(x)$ is an extremely rare multiple of $G(x)$). Codeword accepted.
2. **$S(x) \neq 0$**: Channel distortion detected ($E(x) \neq 0$). Packet rejected.
