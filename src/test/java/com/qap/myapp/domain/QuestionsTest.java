package com.qap.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.qap.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class QuestionsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Questions.class);
        Questions questions1 = new Questions();
        questions1.setId(1L);
        Questions questions2 = new Questions();
        questions2.setId(questions1.getId());
        assertThat(questions1).isEqualTo(questions2);
        questions2.setId(2L);
        assertThat(questions1).isNotEqualTo(questions2);
        questions1.setId(null);
        assertThat(questions1).isNotEqualTo(questions2);
    }
}
