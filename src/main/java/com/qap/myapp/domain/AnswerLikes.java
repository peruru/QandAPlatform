package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AnswerLikes.
 */
@Entity
@Table(name = "answer_likes")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AnswerLikes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties(value = { "answerLikes", "questions" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Answers answers;

    @JsonIgnoreProperties(value = { "questions", "questionLikes", "answerLikes" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Users users;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AnswerLikes id(Long id) {
        this.id = id;
        return this;
    }

    public Answers getAnswers() {
        return this.answers;
    }

    public AnswerLikes answers(Answers answers) {
        this.setAnswers(answers);
        return this;
    }

    public void setAnswers(Answers answers) {
        this.answers = answers;
    }

    public Users getUsers() {
        return this.users;
    }

    public AnswerLikes users(Users users) {
        this.setUsers(users);
        return this;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AnswerLikes)) {
            return false;
        }
        return id != null && id.equals(((AnswerLikes) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AnswerLikes{" +
            "id=" + getId() +
            "}";
    }
}
