import { defineComponent, h } from "vue";

export default defineComponent({
  name: "verificationUser",
  props: {
    code: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  setup(props) {
    return () => (
      <div>
        <h1>
          Код подтверждения:&nbsp;
          <b>{props.code}</b>
        </h1>

        <p>
          <a href={props.link}>Подтвердить регистрацию</a>
        </p>
      </div>
    );
  },
});
