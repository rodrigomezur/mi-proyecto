# CREATIQ

## Descripción
Meta Ads creative analytics SaaS. AI-powered platform that syncs ad accounts, analyzes every creative asset, and surfaces why ads are working or failing — built for performance marketing agencies and DTC brands.

## Para quién
**Agencias de Performance**  El usuario primario de Creatiq. Agencias que manejan múltiples cuentas de clientes en Meta Ads y necesitan escalar su capacidad de análisis creativo sin escalar el equipo. Con Creatiq, un equipo de dos puede manejar el análisis creativo de 15 cuentas con la misma profundidad que antes requería una persona por cliente.  -   Presupuesto mensual manejado: \$50,000 --- \$500,000+ en Meta  -   Reto principal: justificar decisiones creativas a clientes con     > datos, no con opinión  -   Situación actual: usan spreadsheets manuales o no tienen sistema de     > tracking creativo  **Marcas DTC con Equipo Interno**  Marcas de ecommerce con un media buyer o growth marketer interno que necesita velocidad para iterar. El equipo de marketing sabe qué quiere probar, pero pierde horas cada semana tratando de entender qué está funcionando y por qué antes de poder decidir qué producir después.  -   Frecuencia de producción creativa: 10 --- 50 nuevos ads por mes  -   Reto principal: cycle time entre lanzar un ad y tener suficientes     > datos para iterar  -   Situación actual: decisiones creativas basadas en intuición del     > founder o el marketer

## Arquitectura
- Next.js 15 con Pages Router
- Tailwind CSS para estilos
- Supabase para base de datos
- Vercel para despliegue

## Estado actual
- Landing page con formulario de waitlist
- Conectado con Supabase (tabla waitlist)

## Convenciones
- Idioma: español
- Componentes React funcionales con TypeScript
- Variables de entorno en .env.local (no subir a git)
