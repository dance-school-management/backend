/**
 * @openapi
 * /stripe/other/create-checkout-session:
 *   post:
 *     summary: Utwórz sesję Stripe Checkout dla wybranych zajęć
 *     description: >
 *       Tworzy sesję **Stripe Checkout** dla użytkownika zalogowanego (na podstawie `req.user.id`)
 *       i klasy wskazanej w `classId`. Zwraca URL do przekierowania na stronę płatności.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *             properties:
 *               classId:
 *                 type: integer
 *                 example: 123
 *                 description: Identyfikator klasy (tabela `class`)
 *     responses:
 *       '200':
 *         description: URL sesji Stripe Checkout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionUrl:
 *                   type: string
 *                   format: uri
 *                   example: https://checkout.stripe.com/c/test_123
 *       '400':
 *         description: Nieprawidłowe dane wejściowe (np. brak `classId`)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               invalidBody:
 *                 value:
 *                   message: "classId must be a number"
 *       '401':
 *         description: Brak autoryzacji (użytkownik niezalogowany)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               unauthorized:
 *                 value:
 *                   message: "Unauthorized"
 *       '404':
 *         description: Nie znaleziono produktu/klasy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Product not found!"
 *       '500':
 *         description: Błąd serwera (np. problem z Stripe)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               serverError:
 *                 value:
 *                   message: "Internal Server Error"
 */
