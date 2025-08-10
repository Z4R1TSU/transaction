/* Vue 2 directive: v-reveal
 * Adds 'is-visible' class when element enters viewport using IntersectionObserver
 */
const registry = new WeakMap();

export default {
  inserted(el, binding) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: binding.value && binding.value.threshold ? binding.value.threshold : 0.15,
    };

    el.classList.add('reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          const delay = binding.value && binding.value.delay ? Number(binding.value.delay) : 0;
          if (delay) {
            setTimeout(() => el.classList.add('is-visible'), delay);
          } else {
            el.classList.add('is-visible');
          }
          observer.unobserve(el);
        }
      });
    }, options);

    observer.observe(el);
    registry.set(el, observer);
  },
  unbind(el) {
    const observer = registry.get(el);
    if (observer) {
      try { observer.unobserve(el); observer.disconnect(); } catch (_) {}
      registry.delete(el);
    }
  }
};


